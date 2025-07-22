const { v4: uuidv4 } = require('uuid');
const Inventario = require('../ClaseInventario/Inventario');
const { guardarPersonaje } = require('../../utils/personajeUtils');
const objetosDisponibles = require('../../data/objetos.json');
const Objeto = require('../ClaseInventario/Objeto'); 

class Personaje {
  constructor(nombre, tipo, nivel = 1) {
    if (this.constructor === Personaje) {
      throw new Error("El personaje enviado no es del tipo (Personaje)");
    }

    this.id = uuidv4();
    this.nombre = nombre;
    this.tipo = tipo;
    this.nivel = nivel;

    this.saludMaxima = 100 + (nivel - 1) * 10;
    this.salud = this.saludMaxima;
    this.ataque = 10 + (nivel - 1) * 2;
    this.defensaFisica = 5;
    this.defensaMagica = 5;

    this.efectosTemporales = [];
    this.absorcionesPendientes = 0;
    this.inventario = new Inventario();

    this.experiencia = 0;
    this.experienciaParaSubir = 100;
  }

  estaVivo() {
    return this.salud > 0;
  }

  tieneEfecto(nombre) {
    return this.efectosTemporales.some(e => e.nombre === nombre);
  }

  async aplicarEfectoTemporal(efecto) {
    this.efectosTemporales.push(efecto);
    await guardarPersonaje(this);
  }

  async consumirEfecto(nombre) {
    this.efectosTemporales = this.efectosTemporales.filter(e => e.nombre !== nombre);
    await guardarPersonaje(this);
  }

  actualizarEfectosTemporales() {
    this.efectosTemporales = this.efectosTemporales
      .map(ef => ({ ...ef, duracion: ef.duracion - 1 }))
      .filter(ef => ef.duracion > 0);
  }

  recibirDanio(cantidad, tipo = 'fisico') {
  if (this.absorcionesPendientes > 0) {
    this.absorcionesPendientes--;
    console.log(`🛡️ ${this.nombre} absorbió el daño con Reflejo.`);
    return 0;
  }
  console.log(`🎯 ${this.nombre} recibe ${cantidad} de daño (${tipo}).`);

  let defensaAplicada = tipo === 'fisico' ? this.defensaFisica : this.defensaMagica;
  let danioReducido = Math.max(cantidad - defensaAplicada, 1);

  if (this.tieneEfecto('reduccion_fisica') && tipo === 'fisico') {
    const efecto = this.efectosTemporales.find(e => e.nombre === 'reduccion_fisica');
    danioReducido = Math.max(Math.floor(danioReducido * (1 - efecto.valor / 100)), 1);
  }

  this.salud -= danioReducido;
  if (this.salud < 0) this.salud = 0;
  console.log(`🛡️ ${this.nombre} tiene ${defensaAplicada} de defensa (${tipo}).`);
  console.log(`💢 ${this.nombre} recibe ${danioReducido} de daño (${tipo}).`);
  return danioReducido; // <<=== esto es nuevo
}

  usarObjeto(nombreObjeto) {
    if (!this.inventario) return;
    this.inventario.usarPocion(nombreObjeto, this);
  }

  cambiarEquipo(nombreObjeto) {
    if (!this.inventario) return;
    return this.inventario.cambiarEquipo(nombreObjeto);
  }
  subirNivel() {
    this.nivel += 1;
    this.saludMaxima += 10;
    this.salud = this.saludMaxima;
    this.ataque += 2;

    console.log(`${this.nombre} ha subido al nivel ${this.nivel}`);

    // 🎁 OBJETO DE NIVEL ACTUAL
    const compatibles = objetosDisponibles.filter(obj =>
      obj.nivel === this.nivel &&
      (obj.tiposPermitidos.includes(this.tipo) || obj.tiposPermitidos.includes('Todos'))
    );

    if (compatibles.length > 0) {
      const seleccionado = compatibles[Math.floor(Math.random() * compatibles.length)];
      const nuevoObjeto = new Objeto(seleccionado);
      this.inventario.agregarObjeto(nuevoObjeto);
      console.log(`🎁 ¡Has recibido el objeto: "${nuevoObjeto.nombre}"!`);
    } else {
      console.log(`⚠️ No se encontraron objetos compatibles de nivel ${this.nivel}`);
    }

    // 🧪 Poción de curación garantizada
    const pocionBase = objetosDisponibles.find(obj =>
      obj.nombre === "Poción de curación"
    );

    if (pocionBase) {
      const pocion = new Objeto(pocionBase);
      this.inventario.agregarObjeto(pocion);
      console.log(`🧪 ¡También recibiste una poción de curación!`);
    } else {
      console.log(`⚠️ No se encontró la poción de curación en los objetos disponibles.`);
    }
  }
  

}

module.exports = Personaje;
