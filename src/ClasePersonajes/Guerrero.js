const Personaje = require('./Personaje');

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

  getHabilidades() {
    return this.habilidades.map(nombre => ({
      nombre,
      accion: (objetivo) => this.usarHabilidad(nombre, objetivo)
    }));
  }

  usarAtaqueBasico(objetivo) {
    let danio = 3;
    const modificadores = this.inventario.getModificadoresPara('Ataque básico', 'fisico');

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

    objetivo.recibirDanio(danio, 'fisico');
    return `${this.nombre} ataca con fuerza causando ${danio} de daño físico a ${objetivo.nombre}.`;
  }

  usarFuria() {
    const tieneObjeto = this.inventario.getModificadoresPara('Furia')
      .some(mod => mod.tipo === 'daño' && mod.valor >= 1);

    if (tieneObjeto) {
      this.aplicarEfectoTemporal({ nombre: 'daño_doble', duracion: 1, modo: 'garantizado' });
      return `${this.nombre} toca el Cuerno de Guerra: ¡el próximo ataque hará daño doble garantizado!`;
    } else {
      this.aplicarEfectoTemporal({ nombre: 'daño_doble', duracion: 1, modo: 'probable' });
      return `${this.nombre} entra en furia: el próximo ataque podría hacer daño doble.`;
    }
  }

  usarGritoDefensivo() {
    const modificadores = this.inventario.getModificadoresPara('defensa', 'aumentar');
    let reduccion = 50;

    modificadores.forEach(mod => {
      if (mod.tipo === 'defensa' && mod.modo === 'aumentar') {
        reduccion += mod.valor;
      }
    });

    // Aplica efecto temporal de reducción de daño físico recibido
    this.aplicarEfectoTemporal({ nombre: 'reduccion_fisica', duracion: 1, valor: reduccion });

    return `${this.nombre} lanza un grito defensivo. El siguiente ataque físico se reducirá un ${reduccion}%.`;
  }
}

module.exports = Guerrero;
