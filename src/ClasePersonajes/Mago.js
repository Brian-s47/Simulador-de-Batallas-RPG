// Zona de importaciones ********************************************************************************************************************************
const Personaje = require('./Personaje');// Clase "Personaje" padre para extender por herencia

// Creacion de clase Mago, subclase de Personaje que extiende sus atributos del padre "Personaje"
class Mago extends Personaje {
  // Constructor y datos que se reciben
  constructor(nombre) { // recibimos el nombre del personaje indicado por el jugador
    super(nombre, 'Mago');// Llamamos a la super clase y le pasamos el nombre y al tipo de personaje

    // Asignacion de atribibutos especiales de la subclase
    // this.salud += 0; // sin bodinifacion de salud extra
    this.defensaMagica += 2; // Mayor resistencia magica a la de las demas subclases
    // Asignacion de habilidades especiales de la subclase para mostrar en menus y conectar segun corresponda
    this.habilidades = [
      'Reflejo',
      'Bola de fuego',
      'Bola de hielo',
      'Usar objeto' // Esta habilidad se conecta con la superclase Personaje ya que es una habilidad que todos los tipos de personaje tienen
    ];
  }
  // Metodos *****************************************************************************************************************************
  
  // Metodo para usar habilidad el cual descenraliza la responzabilidad de ejecutar los ataques y los ejecuta de manera correcta
  usarHabilidad(nombre) {
    switch (nombre) {
      case 'Reflejo':
        return this.usarReflejo();
      case 'Bola de fuego':
        return this.usarBolaDeFuego();
      case 'Bola de hielo':
        return this.usarBolaDeHielo();
      case 'Usar objeto':
        return 'Objeto usado';
      default:
        return 'Habilidad no reconocida'; // Opcion de descarte para fallas en el menu
    }
  }
  // Metodo para habilidad especial 'Reflejo'
  usarReflejo() {
    let absorciones = 1;

    // Validacion de modificadores
    const modificadores = this.inventario.getModificadoresPara('Reflejo'); // Validar si algun item de inventario modifica tipo de ataque o habilidad especifica
    modificadores.forEach(modificador => { // Ciclo para aplicar modificadores segun corresponde
        if (modificador.tipo === 'absorcion' && modificador.modo === 'aumentar') { // Validacion de condicion para activar efecto
            absorciones += modificador.valor; // Aplicacion de bonificacion de efecto
        }
    });
    this.absorcionesPendientes += absorciones; // Aplicacion de bonificacion de efecto
    return `${this.nombre} crea ${absorciones} reflejos que absorberán ${absorciones} ataques`;
  }

  // Metodo para habilidad especial 'Bola de fuego'
  usarBolaDeFuego() {
    let danio = 5;
    
    // Validacion de modificadores
    const modificadores = this.inventario.getModificadoresPara('Bola de fuego', 'magico'); // Validar si algun item de inventario modifica tipo de ataque o habilidad especifica
    modificadores.forEach(modificador => { // Ciclo para aplicar modificadores segun corresponde
        if (modificador.tipo === 'daño' && modificador.modo === 'aumentar') { // Validacion de condicion para activar efecto
        danio += modificador.valor; // Aplicacion de bonificacion de efecto
        }
    });
    return `${this.nombre} lanza una bola de fuego que causa ${danio} de daño`;
  }
  // Metodo para habilidad especial 'Bola de hielo'
  usarBolaDeHielo() {
    let danio = 3;

    // Validacion de modificadores
    const modificadores = this.inventario.getModificadoresPara('Bola de hielo', 'magico'); // Validar si algun item de inventario modifica tipo de ataque o habilidad especifica
    modificadores.forEach(modificador => { // Ciclo para aplicar modificadores segun corresponde
        if (modificador.tipo === 'daño' && modificador.modo === 'aumentar') { // Validacion de condicion para activar efecto
        danio += modificador.valor; // Aplicacion de bonificacion de efecto
        }
    });
    return `${this.nombre} lanza una bola de hielo que causa ${danio} de daño y reduce el ataque físico enemigo`;
  }
}

module.exports = Mago;
