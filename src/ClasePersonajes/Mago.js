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
  // Metodo para usar las habilidades
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
  // Metodo para obtenr habilidades
  getHabilidades() {
    return this.habilidades.map(nombre => ({
      nombre,
      accion: (objetivo) => this.usarHabilidad(nombre, objetivo)
    }));
  }
  // Metodo de habilidad "Reflejo"
  usarReflejo() {
    let absorcionesBase = 1;
    let absorcionesTotales = absorcionesBase;
    const detalles = [`🔮 Absorciones base: ${absorcionesBase}`];

    const modificadores = this.inventario.getModificadoresPara('Reflejo');
    modificadores.forEach(mod => {
      if (mod.tipo === 'absorcion' && mod.modo === 'aumentar') {
        absorcionesTotales += mod.valor;
        detalles.push(`🔧 Modificador de objeto: +${mod.valor} absorciones`);
      }
    });

    this.absorcionesPendientes += absorcionesTotales;
    detalles.push(`🛡️ Absorciones totales activas: ${this.absorcionesPendientes}`);

    return `${this.nombre} invoca Reflejo.\n` + detalles.join('\n');
  }
  // Metodo de habilidad "Bola de fuego"
  usarBolaDeFuego(objetivo) {
    let danioBase = 5;
    let danio = danioBase;
    const detalles = [`🔥 Daño base: ${danioBase}`];

    const modificadores = this.inventario.getModificadoresPara('Bola de fuego', 'magico');
    modificadores.forEach(mod => {
      if (mod.tipo === 'daño' && mod.modo === 'aumentar') {
        danio += mod.valor;
        detalles.push(`🔧 Modificador de objeto: +${mod.valor} daño mágico`);
      }
    });

    if (this.tieneEfecto('daño_doble')) {
      const efecto = this.efectosTemporales.find(e => e.nombre === 'daño_doble');
      const debeActivarse = efecto.modo === 'garantizado' || Math.random() < 0.5;
      this.consumirEfecto('daño_doble');

      if (debeActivarse) {
        danio *= 2;
        detalles.push(`🔥 Daño doble activado`);
      } else {
        detalles.push(`❌ Daño doble no se activó`);
      }
    }
    detalles.push(`🎯 Daño mágico infligido a ${objetivo.nombre}: ${danio}`);
    objetivo.recibirDanio(danio, 'magico');
    

    return `${this.nombre} lanza una Bola de Fuego.\n` + detalles.join('\n');
  }
  // Metodo de habilidad "Bola de hielo"
  usarBolaDeHielo(objetivo) {
    let danioBase = 3;
    let danio = danioBase;
    const detalles = [`❄️ Daño base: ${danioBase}`];

    const modificadores = this.inventario.getModificadoresPara('Bola de hielo', 'magico');
    modificadores.forEach(mod => {
      if (mod.tipo === 'daño' && mod.modo === 'aumentar') {
        danio += mod.valor;
        detalles.push(`🔧 Modificador de objeto: +${mod.valor} daño mágico`);
      }
    });

    if (this.tieneEfecto('daño_doble')) {
      const efecto = this.efectosTemporales.find(e => e.nombre === 'daño_doble');
      const debeActivarse = efecto.modo === 'garantizado' || Math.random() < 0.5;
      this.consumirEfecto('daño_doble');

      if (debeActivarse) {
        danio *= 2;
        detalles.push(`🔥 Daño doble activado`);
      } else {
        detalles.push(`❌ Daño doble no se activó`);
      }
    }
    detalles.push(`🎯 Daño mágico infligido a ${objetivo.nombre}: ${danio}`);
    objetivo.recibirDanio(danio, 'magico');

    // Aplica penalización al ataque del enemigo
    const reduccion = 2;
    objetivo.aplicarEfectoTemporal({ nombre: 'ataque_reducido', duracion: 1, valor: reduccion });
    detalles.push(`📉 ${objetivo.nombre} tendrá su ataque reducido en ${reduccion} en el próximo turno`);

    return `${this.nombre} lanza una Bola de Hielo.\n` + detalles.join('\n');
  }
}

module.exports = Mago;
