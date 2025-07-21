const Personaje = require('./Personaje');

class Arquero extends Personaje {
  constructor(nombre, defensaExtra) {
    super(nombre, 'Arquero');
    this.salud += 5;

    if (defensaExtra === 'fisica') {
      this.defensaFisica += 2;
    } else {
      this.defensaMagica += 2;
    }

    this.habilidades = [
      'Flecha perforante',
      'Flecha arcana',
      'Apuntar',
      'Usar objeto'
    ];
  }
  // Metodo para usar las habilidades
  usarHabilidad(nombre, objetivo) {
    switch (nombre) {
      case 'Flecha perforante':
        return this.usarFlechaPerforante(objetivo);
      case 'Flecha arcana':
        return this.usarFlechaArcana(objetivo);
      case 'Apuntar':
        return this.usarApuntar();
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
  // Metodo de habilidad "Flecha perforante"
  usarFlechaPerforante(objetivo) {
    let danioBase = 4;
    let danio = danioBase;
    const modificadores = this.inventario.getModificadoresPara('Flecha perforante', 'fisico');
    let detalles = [`🏹 Daño base: ${danioBase}`];

    modificadores.forEach(mod => {
      if (mod.tipo === 'daño' && mod.modo === 'aumentar') {
        danio += mod.valor;
        detalles.push(`🔧 Modificador de objeto: +${mod.valor} daño físico`);
      }
    });

    // Aplicar efecto de daño doble si existe
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
    // Daño directo (ignora defensa)
    objetivo.salud -= danio;
    if (objetivo.salud < 0) objetivo.salud = 0;

    detalles.push(`🎯 Daño directo infligido a ${objetivo.nombre}: ${danio} (ignora defensa)`);

    return `${this.nombre} dispara una Flecha Perforante.\n` + detalles.join('\n');
  }

  // Metodo de habilidad "Flecha arcana"
  usarFlechaArcana(objetivo) {
    let danio = 4;
    const modificadores = this.inventario.getModificadoresPara('Flecha arcana', 'magico');

    modificadores.forEach(mod => {
      if (mod.tipo === 'daño' && mod.modo === 'aumentar') {
        danio += mod.valor;
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

    objetivo.recibirDanio(danio, 'magico');
    return `${this.nombre} lanza una flecha arcana que inflige ${danio} de daño mágico a ${objetivo.nombre}`;
  }
  // Metodo de habilidad "Apuntar"
  usarApuntar() {
    let probabilidadBase = 0.5;
    let probabilidadExtra = 0;
    const detalles = [];

    const modificadores = this.inventario.getModificadoresPara('Apuntar');
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
    probabilidad: 0.5 + (probabilidadExtra / 100)
  });

    detalles.push(`🎯 Probabilidad total de daño doble aplicada: ${(probabilidadFinal * 100).toFixed(0)}%`);

    return `${this.nombre} se concentra para Apuntar.\n` + detalles.join('\n');
  }  
}

module.exports = Arquero;
