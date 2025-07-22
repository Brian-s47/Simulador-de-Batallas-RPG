const Personaje = require('./Personaje.js');
console.log('DEBUG >> Personaje:', typeof Personaje);

class Guerrero extends Personaje {
  constructor(nombre) {
    super(nombre, 'Guerrero');
    this.salud += 10;
    this.defensaFisica += 2;
    this.habilidades = [
      'Ataque básico',
      'Furia',
      'Grito defensivo',
      'Usar objeto'
    ];
  }
  // Metodo para usar las habilidades
  usarHabilidad(nombre, objetivo) {
    switch (nombre) {
      case 'Ataque básico':
        return this.usarAtaqueBasico(objetivo);
      case 'Furia':
        return this.usarFuria();
      case 'Grito defensivo':
        return this.usarGritoDefensivo();
      case 'Usar objeto':
        this.usarObjeto('pocion');
        return `${this.nombre} usa un objeto del inventario.`;
      default:
        return 'Habilidad no reconocida';
    }
  }
  // Metodo para obtenr habilidades
  getHabilidades() {
    return this.habilidades.map(nombre => ({
      nombre,
      accion: (objetivo) => this.usarHabilidad(nombre, objetivo)
    }));
  }
  // Metodo de habilidad "Ataque básico"
  usarAtaqueBasico(objetivo) {
    let danioBase = 3;
    let danio = danioBase;
    const modificadores = this.inventario.getModificadoresPara('Ataque básico', 'fisico');

    let detalles = [`🗡️ Daño base: ${danioBase}`];

    modificadores.forEach(mod => {
      if (mod.tipo === 'daño' && mod.modo === 'aumentar') {
        danio += mod.valor;
        detalles.push(`🔧 Modificador de objeto: +${mod.valor} daño físico`);
      }
    });

    if (this.tieneEfecto('daño_doble')) {
      const efectoDoble = this.efectosTemporales.find(e => e.nombre === 'daño_doble');
      if (efectoDoble) {
        const probabilidad = efectoDoble.probabilidad || 0.5;
        const activado = Math.random() < probabilidad;
        this.consumirEfecto('daño_doble');

        if (activado) {
          detalles.push(`🔥 Daño doble activado por efecto (${(probabilidad * 100).toFixed(0)}%)`);
          danio *= 2;
        } else {
          detalles.push(`❌ Efecto de daño doble falló (${(probabilidad * 100).toFixed(0)}%)`);
        }
      }
    }  

    objetivo.recibirDanio(danio, 'fisico');
    detalles.push(`🎯 Daño final infligido a ${objetivo.nombre}: ${danio}`);

    return `${this.nombre} ejecuta un Ataque Básico.\n` + detalles.join('\n');
  }
  // Metodo de habilidad "Furia"
  usarFuria() {
    let probabilidadBase = 0.5;
    let probabilidadExtra = 0;

    const modificadores = this.inventario.getModificadoresPara('Furia');
    const detalles = [];

    modificadores.forEach(mod => {
      if (mod.tipo === 'daño' && mod.modo === 'aumentar') {
        probabilidadExtra += mod.valor;
        detalles.push(`🔧 Modificador de objeto: +${mod.valor}% a probabilidad de daño doble`);
      }
    });

    const probabilidadFinal = probabilidadBase + (probabilidadExtra / 100);

    this.aplicarEfectoTemporal({
      nombre: 'daño_doble',
      duracion: 1,
      modo: 'probable',
      probabilidad: probabilidadFinal
    });

    detalles.push(`🎯 Probabilidad total de daño doble: ${(probabilidadFinal * 100).toFixed(0)}%`);

    return `${this.nombre} entra en estado de furia.\n` + detalles.join('\n');
  }
  // Metodo de habilidad "Grito defensivo"
  usarGritoDefensivo() {
    let reduccionBase = 50;
    let reduccionTotal = reduccionBase;
    const detalles = [`🛡️ Reducción base de daño físico: ${reduccionBase}%`];

    const modificadores = this.inventario.getModificadoresPara('defensa', 'aumentar');
    modificadores.forEach(mod => {
      if (mod.tipo === 'defensa' && mod.modo === 'aumentar') {
        reduccionTotal += mod.valor;
        detalles.push(`🔧 Modificador de objeto: +${mod.valor}%`);
      }
    });

    // Aplica el efecto
    this.aplicarEfectoTemporal({ nombre: 'reduccion_fisica', duracion: 1, valor: reduccionTotal });

    detalles.push(`🧱 Reducción total aplicada: ${reduccionTotal}%`);

    return `${this.nombre} lanza un grito defensivo.\n` + detalles.join('\n');
  }
}

module.exports = Guerrero;