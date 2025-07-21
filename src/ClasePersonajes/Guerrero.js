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
      const probabilidad = efecto.probabilidad || 0.5;
      const debeActivarse = Math.random() < probabilidad;

      if (debeActivarse) danio *= 2;
      this.consumirEfecto('daño_doble');
    }

    objetivo.recibirDanio(danio, 'fisico');
    return `${this.nombre} ataca con fuerza causando ${danio} de daño físico a ${objetivo.nombre}.`;
  }
  // Metodo de habilidad "Furia"
  usarFuria() {
    let probabilidadExtra = 0;
  
    // Sumamos el % extra por modificadores de objetos
    const modificadores = this.inventario.getModificadoresPara('Furia');
    modificadores.forEach(mod => {
      if (mod.tipo === 'daño' && mod.modo === 'aumentar') {
        probabilidadExtra += mod.valor; // cada punto = 1%
      }
    });
  
    // Aplicamos efecto con probabilidad base + extra
    this.aplicarEfectoTemporal({
      nombre: 'daño_doble',
      duracion: 1,
      modo: 'probable',
      probabilidad: 0.5 + (probabilidadExtra / 100) // base 50% + bonus
    });
  
    return `${this.nombre} entra en furia: el próximo ataque tiene ${(50 + probabilidadExtra)}% de probabilidad de hacer daño doble.`;
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