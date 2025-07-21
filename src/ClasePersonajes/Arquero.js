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

  getHabilidades() {
    return this.habilidades.map(nombre => ({
      nombre,
      accion: (objetivo) => this.usarHabilidad(nombre, objetivo)
    }));
  }

  usarFlechaPerforante(objetivo) {
    let danio = 4;
    const modificadores = this.inventario.getModificadoresPara('Flecha perforante', 'fisico');

    modificadores.forEach(mod => {
      if (mod.tipo === 'daño' && mod.modo === 'aumentar') {
        danio += mod.valor;
      }
    });

    if (this.tieneEfecto('daño_doble')) {
      const efecto = this.efectosTemporales.find(e => e.nombre === 'daño_doble');
      const probabilidad = efecto.probabilidad || 0.5;
      const debeActivarse = Math.random() < probabilidad;
      if (debeActivarse) danio *= 2;
      this.consumirEfecto('daño_doble');
    }

    // Ignora defensa física: aplicar sin reducción
    objetivo.salud -= danio;
    if (objetivo.salud < 0) objetivo.salud = 0;

    return `${this.nombre} dispara una flecha perforante ignorando la armadura y causando ${danio} de daño directo a ${objetivo.nombre}`;
  }

  usarFlechaArcana(objetivo) {
    let danio = 4;
    const modificadores = this.inventario.getModificadoresPara('Flecha arcana', 'magico');

    modificadores.forEach(mod => {
      if (mod.tipo === 'daño' && mod.modo === 'aumentar') {
        danio += mod.valor;
      }
    });

    if (this.tieneEfecto('daño_doble')) {
      const efecto = this.efectosTemporales.find(e => e.nombre === 'daño_doble');
      const probabilidad = efecto.probabilidad || 0.5;
      const debeActivarse = Math.random() < probabilidad;

      if (debeActivarse) danio *= 2;
      this.consumirEfecto('daño_doble');
    }

    objetivo.recibirDanio(danio, 'magico');
    return `${this.nombre} lanza una flecha arcana que inflige ${danio} de daño mágico a ${objetivo.nombre}`;
  }

  usarApuntar() {
    let probabilidadExtra = 0;
  
    const modificadores = this.inventario.getModificadoresPara('Apuntar');
    modificadores.forEach(mod => {
      if (mod.tipo === 'daño' && mod.modo === 'aumentar') {
        probabilidadExtra += mod.valor;
      }
    });
  
    this.aplicarEfectoTemporal({
      nombre: 'daño_doble',
      duracion: 1,
      modo: 'probable',
      probabilidad: 0.5 + (probabilidadExtra / 100)
    });
  
    return `${this.nombre} apunta con precisión: el próximo ataque tiene ${(50 + probabilidadExtra)}% de probabilidad de hacer daño doble.`;
  }
  
}

module.exports = Arquero;
