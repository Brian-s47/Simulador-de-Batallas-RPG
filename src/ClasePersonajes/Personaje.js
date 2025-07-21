const { v4: uuidv4 } = require('uuid');
const Inventario = require('../ClaseInventario/Inventario');
const objetosDisponibles = require('../../data/objetos.json');  // traer los objetos disponibles del json
const Objeto = require('../ClaseInventario/Objeto'); // Clase para instanciar objetos

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

    // Nuevos atributos para sistema de experiencia
    this.experiencia = 0;
    this.experienciaParaSubir = 100;
  }
  // Metodo para atacar
  atacar(objetivo) {
    throw new Error("Método 'atacar' debe ser implementado en subclases");
  }
  // Metodo para recibir daño 
  recibirDanio(cantidad, tipo = 'fisico') {
    if (this.absorcionesPendientes > 0) {
      this.absorcionesPendientes -= 1;
      console.log(`${this.nombre} ha absorbido completamente el daño con Reflejo. Le quedan ${this.absorcionesPendientes} cargas.`);
      return;
    }

    let defensa = tipo === 'magico' ? this.defensaMagica : this.defensaFisica;
    const danioReal = Math.max(cantidad - defensa, 0);
    this.salud -= danioReal;
    if (this.salud < 0) this.salud = 0;
    console.log(`${this.nombre} recibió ${danioReal} de daño (${tipo})`);
  }
  // Metodo para subir de nivel cuando gana una batalla
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

    // 🧪 POCIÓN DE CURACIÓN (única)
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
  // Metodo para usar objeto
  usarObjeto(nombreObjeto) {
    if (!this.inventario) return;
    this.inventario.usarPocion(nombreObjeto, this);
  }
  // Metodo para cmabiar equipo 
  cambiarEquipo(nombreObjeto) {
    if (!this.inventario) return;
    return this.inventario.cambiarEquipo(nombreObjeto);
  }
  // Metodo para 
  getHabilidades() {
    return [];
  }
  // Metodo para verificar si el personaje esta vivo 
  estaVivo() {
    return this.salud > 0;
  }
  // Metodo para obtener el equipamiento
  getEquipamiento() {
    return this.inventario.getEquipados();
  }
  // Metodo para aplicar un efecto temporal
  aplicarEfectoTemporal(efecto) {
    this.efectosTemporales.push(efecto);
  }
  // Metodo para verificar si se tiene un efecto tmeporal
  tieneEfecto(nombre) {
    return this.efectosTemporales.some(efecto => efecto.nombre === nombre);
  }
  // Metodo para consumir el efecto temporal segun el nombre devulelto
  consumirEfecto(nombre) {
    this.efectosTemporales = this.efectosTemporales.filter(efecto => efecto.nombre !== nombre);
  }
  // Metodo para obtener los modificadores
  getModificadoresPara(habilidad = null, tipoDanio = null) {
    const equipados = this.getEquipamiento();
    let modificadores = [];

    equipados.forEach(obj => {
      if (obj.modificadores && Array.isArray(obj.modificadores)) {
        obj.modificadores.forEach(mod => {
          const afecta = mod.afecta || {};
          const coincideHabilidad = habilidad ? afecta.habilidad === habilidad : true;
          const coincideTipoDanio = tipoDanio ? afecta.tipoDanio === tipoDanio : true;

          if (coincideHabilidad && coincideTipoDanio) {
            modificadores.push(mod);
          }
        });
      }
    });

    return modificadores;
  }
}

module.exports = Personaje;
