// Zona de importaciones ********************************************************************************************************************************
const Personaje = require('./Personaje');// Clase "Personaje" padre para extender por herencia

// Creacion de clase Arquero, subclase de Personaje que extiende sus atributos del padre "Personaje"
class Arquero extends Personaje {
  // Constructor y datos que se reciben
  constructor(nombre, defensaExtra) { // recibimos el nombre del personaje indicado por el jugador y el efecto elegido en el menu especial para esta subclase
    super(nombre, 'Arquero');  // Llamamos a la super clase y le passamos el nombre y al tipo de personaje
    
    // Asignacion de atribibutos especiales de la subclase
    this.salud += 5;
    if (defensaExtra === 'fisica') { // condicion para aplicar segun lo elegido por el jugador
      this.defensaFisica += 2;
    } else {
      this.defensaMagica += 2;
    }

    // Asignacion de habilidades especiales de la subclase para mostrar en menus y conectar segun corresponda
    this.habilidades = [
      'Flecha perforante',
      'Flecha arcana',
      'Apuntar',
      'Usar objeto'// Esta habilidad se conecta con la superclase Personaje ya que es una habilidad que todos los tipos de personaje tienen
    ];
  }
  // Metodos *****************************************************************************************************************************

  // Metodo para usar habilidad el cual descenraliza la responzabilidad de ejecutar los ataques y los ejecuta de manera correcta
  usarHabilidad(nombre) {
    switch (nombre) {
      case 'Flecha perforante':
        return this.usarFlechaPerforante();
      case 'Flecha arcana':
        return this.usarFlechaArcana();
      case 'Apuntar':
        
      case 'Usar objeto':
        return 'Objeto usado';
      default:
        return 'Habilidad no reconocida'; // Opcion de descarte para fallas en el menu
    }
  }
  // Metodo para habilidad especial 'Flecha perforante'
  usarFlechaPerforante() {
    let danio = 4;// Daño basico de la habilidad

    // Validacion de modificadores
    const modificadores = this.inventario.getModificadoresPara('Flecha perforante', 'fisico'); // Validar si algun item de inventario modifica tipo de ataque o habilidad especifica
    modificadores.forEach(modificador => { // Ciclo para aplicar modificadores segun corresponde
        if (modificador.tipo === 'daño' && modificador.modo === 'aumentar') { // Validacion de condicion para activar efecto
        danio += modificador.valor; // Aplicacion de bonificacion de efecto
        }
    });

    // Validacion de modificadores de estados temporales
    if (this.tieneEfecto('daño_doble')) { // Validacion de efecto 
        const efecto = this.efectosTemporales.find(efecto => efecto.nombre === 'daño_doble'); // Validacion de nombre del efecto
        const debeActivarse = efecto.modo === 'garantizado' || Math.random() < 0.5; // Aleatoriedad de doble daño

        if (debeActivarse) { // si se tiene efecto garantizado
        danio *= 2;
        }

        this.consumirEfecto('daño_doble'); // Metodo para consumir el efecto que ya se uso 
    }

    return `${this.nombre} dispara una flecha perforante que causa ${danio} de daño ignorando la armadura fisica`;
  }

  // Metodo para habilidad especial 'Flecha arcana'
  usarFlechaArcana() {
    let danio = 4;// Daño basico de la habilidad

    // Validacion de modificadores
    const modificadores = this.inventario.getModificadoresPara('Flecha arcana', 'magico'); // Validar si algun item de inventario modifica tipo de ataque o habilidad especifica
    modificadores.forEach(modificador => { // Ciclo para aplicar modificadores segun corresponde
        if (modificador.tipo === 'daño' && modificador.modo === 'aumentar') { // Validacion de condicion para activar efecto
        danio += modificador.valor; // Aplicacion de bonificacion de efecto
        }
    });

    // Validacion de modificadores de estados temporales
    if (this.tieneEfecto('daño_doble')) { // Validacion de efecto 
        const efecto = this.efectosTemporales.find(efecto => efecto.nombre === 'daño_doble'); // Validacion de nombre del efecto
        const debeActivarse = efecto.modo === 'garantizado' || Math.random() < 0.5; // Aleatoriedad de doble daño

        if (debeActivarse) { // si se tiene efecto garantizado
        danio *= 2;
        }

        this.consumirEfecto('daño_doble'); // Metodo para consumir el efecto que ya se uso 
    }
  }
  // Metodo para habilidad especial 'Apuntar'
  usarApuntar(){

    // Verificamos si tiene objeto que modifica la habilidad
    const tieneObjeto = this.inventario.getModificadoresPara('Apuntar') 
    .some(modificador => modificador.tipo === 'daño' && modificador.valor >= 1);

    // Validacion para mejorar efecto temporal
    if (tieneObjeto) {
        this.aplicarEfectoTemporal({ nombre: 'daño_doble', duracion: 1, modo: 'garantizado'});
        return `${this.nombre} Usa mira preciza: ¡el próximo ataque hará daño doble garantizado!`;
    } else {
        this.aplicarEfectoTemporal({ nombre: 'daño_doble', duracion: 1, modo: 'probable' });
        return `${this.nombre} apunta con calma: el próximo ataque puede hacer el doble de daño`;
    }
  }
}

module.exports = Arquero;