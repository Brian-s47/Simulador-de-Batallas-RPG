const Personaje = require('./Personaje');

class Mago extends Personaje {
  constructor(nombre) {
    super(nombre, 'Mago');
    this.defensaMagica += 2;
    this.habilidades = [
      'Reflejo',
      'Bola de fuego',
      'Bola de hielo',
      'Usar objeto'
    ];
  }

  usarHabilidad(nombre, objetivo) {
    switch (nombre) {
      case 'Reflejo':
        return this.usarReflejo();
      case 'Bola de fuego':
        return this.usarBolaDeFuego(objetivo);
      case 'Bola de hielo':
        return this.usarBolaDeHielo(objetivo);
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

  usarReflejo() {
    let absorciones = 1;
    const modificadores = this.inventario.getModificadoresPara('Reflejo');

    modificadores.forEach(mod => {
      if (mod.tipo === 'absorcion' && mod.modo === 'aumentar') {
        absorciones += mod.valor;
      }
    });

    this.absorcionesPendientes += absorciones;
    return `${this.nombre} crea ${absorciones} reflejos que absorberán ataques enemigos.`;
  }

  usarBolaDeFuego(objetivo) {
    let danio = 5;

    const modificadores = this.inventario.getModificadoresPara('Bola de fuego', 'magico');
    modificadores.forEach(mod => {
      if (mod.tipo === 'daño' && mod.modo === 'aumentar') {
        danio += mod.valor;
      }
    });

    if (this.tieneEfecto('daño_doble')) {
      const efecto = this.efectosTemporales.find(e => e.nombre === 'daño_doble');
      const debeActivarse = efecto.modo === 'garantizado' || Math.random() < 0.5;
      if (debeActivarse) danio *= 2;
      this.consumirEfecto('daño_doble');
    }

    objetivo.recibirDanio(danio, 'magico');
    return `${this.nombre} lanza una bola de fuego que causa ${danio} de daño mágico a ${objetivo.nombre}.`;
  }

  usarBolaDeHielo(objetivo) {
    let danio = 3;

    const modificadores = this.inventario.getModificadoresPara('Bola de hielo', 'magico');
    modificadores.forEach(mod => {
      if (mod.tipo === 'daño' && mod.modo === 'aumentar') {
        danio += mod.valor;
      }
    });

    if (this.tieneEfecto('daño_doble')) {
      const efecto = this.efectosTemporales.find(e => e.nombre === 'daño_doble');
      const debeActivarse = efecto.modo === 'garantizado' || Math.random() < 0.5;
      if (debeActivarse) danio *= 2;
      this.consumirEfecto('daño_doble');
    }

    objetivo.recibirDanio(danio, 'magico');

    // Aplica penalización al ataque físico
    objetivo.aplicarEfectoTemporal({ nombre: 'ataque_reducido', duracion: 1, valor: 2 });

    return `${this.nombre} lanza una bola de hielo que causa ${danio} de daño mágico y reduce el ataque físico de ${objetivo.nombre}.`;
  }
}

module.exports = Mago;
