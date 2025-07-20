const { v4: uuidv4 } = require('uuid');
const Inventario = require('../ClaseInventario/Inventario');

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

  atacar(objetivo) {
    throw new Error("Método 'atacar' debe ser implementado en subclases");
  }

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

  subirNivel() {
    this.nivel += 1;
    this.experiencia -= this.experienciaParaSubir;
    this.experienciaParaSubir = Math.floor(this.experienciaParaSubir * 1.5); // Escala la exp necesaria
    this.saludMaxima += 10;
    this.salud = this.saludMaxima;
    this.ataque += 2;
    console.log(`${this.nombre} ha subido al nivel ${this.nivel}`);
  }

  ganarExperiencia(cantidad) {
    this.experiencia += cantidad;
    console.log(`${this.nombre} ha ganado ${cantidad} de experiencia. Total: ${this.experiencia}/${this.experienciaParaSubir}`);
    
    while (this.experiencia >= this.experienciaParaSubir) {
      this.subirNivel();
    }
  }

  usarObjeto(nombreObjeto) {
    if (!this.inventario) return;
    this.inventario.usarPocion(nombreObjeto, this);
  }

  cambiarEquipo(nombreObjeto) {
    if (!this.inventario) return;
    return this.inventario.cambiarEquipo(nombreObjeto);
  }

  getHabilidades() {
    return [];
  }

  estaVivo() {
    return this.salud > 0;
  }

  getEquipamiento() {
    return this.inventario.getEquipados();
  }

  aplicarEfectoTemporal(efecto) {
    this.efectosTemporales.push(efecto);
  }

  tieneEfecto(nombre) {
    return this.efectosTemporales.some(efecto => efecto.nombre === nombre);
  }

  consumirEfecto(nombre) {
    this.efectosTemporales = this.efectosTemporales.filter(efecto => efecto.nombre !== nombre);
  }

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
