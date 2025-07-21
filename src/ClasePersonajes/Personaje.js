const { v4: uuidv4 } = require('uuid');
const Inventario = require('../ClaseInventario/Inventario');
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
  // Metodo para atacar
  atacar(objetivo) {
    throw new Error("Método 'atacar' debe ser implementado en subclases");
  }
  // Metodo para recibir daño con filtrados de fisico y magico aplicando defensas
  recibirDanio(cantidad, tipo = 'fisico', opciones = {}) {
    if (this.absorcionesPendientes > 0) {
      this.absorcionesPendientes -= 1;
      console.log(`${this.nombre} ha absorbido completamente el daño con Reflejo. Le quedan ${this.absorcionesPendientes} cargas.`);
      return;
    }

    let defensa = tipo === 'magico' ? this.defensaMagica : this.defensaFisica;

    // Ignorar defensa si se especifica
    if (opciones.ignorarDefensa) {
      defensa = 0;
    }

    // Aplicar reducción física si corresponde
    if (tipo === 'fisico' && this.tieneEfecto('reduccion_fisica')) {
      const efecto = this.efectosTemporales.find(e => e.nombre === 'reduccion_fisica');
      const porcentaje = efecto.valor || 50;
      cantidad = Math.floor(cantidad * (1 - porcentaje / 100));
      this.consumirEfecto('reduccion_fisica');
      console.log(`${this.nombre} reduce el daño físico recibido en un ${porcentaje}% gracias a un efecto defensivo.`);
    }

    // Cálculo de daño real
    const danioReal = Math.max(cantidad - defensa, cantidad > 0 ? 1 : 0);
    this.salud -= danioReal;
    if (this.salud < 0) this.salud = 0;

    console.log(`${this.nombre} recibió ${danioReal} de daño (${tipo})`);
  }
  // Metodo para subir de nivel con aumento de estadisticas y recomepenzas segun corresponde
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
  // Metodo para usar objeto de momento solko pociones de salud son usables en el inventario
  usarObjeto(nombreObjeto) {
    if (!this.inventario) return;
    this.inventario.usarPocion(nombreObjeto, this);
  }
  // Metodo para cambiar objetos del inventario de equipados a no equipados cumpliendo condiciones de una mano y dos manos segun logica 
  cambiarEquipo(nombreObjeto) {
    if (!this.inventario) return;
    return this.inventario.cambiarEquipo(nombreObjeto);
  }
  // Metodo para objetener las habilidades de la subclase en especifico
  getHabilidades() {
    return [];
  }
  // Metodo para verificaion de que el perosnaje aun este vivo si vida sea mayor a 0
  estaVivo() {
    return this.salud > 0;
  }
  // Metodo para obtener los objetos actualmente con el estatus de equipados
  getEquipamiento() {
    return this.inventario.getEquipados();
  }
  // Metodo para aplicar un efecto temporal a la lista de efectos del personaje
  aplicarEfectoTemporal(efecto) {
    this.efectosTemporales.push(efecto);
  }
  // Metodo para verificar si el personaje tiene un efeco especifico por nombre 
  tieneEfecto(nombre) {
    return this.efectosTemporales.some(e => e.nombre === nombre);
  }
  // Metodo para consumir un efecto temporal al ser usado
  consumirEfecto(nombre) {
    this.efectosTemporales = this.efectosTemporales.filter(e => e.nombre !== nombre);
  }
  // M;etodo para actuliz<ar duracion de efectos temporales
  actualizarEfectosTemporales() {
    this.efectosTemporales = this.efectosTemporales
      .map(e => ({ ...e, duracion: e.duracion - 1 }))
      .filter(e => e.duracion > 0);
  }
  // Metodo para obteenr los modificadores de habilidad y tipo segun inventario
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
// Exportacion de modulos de la super clase "Personaje" 
module.exports = Personaje;
