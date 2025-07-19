// Zona de importaciones ********************************************************************************************************************************
const Personaje = require('./Personaje'); // Clase "Personaje" padre para extender por herencia

// Creacion de clase Guerrero, subclase de PErsonaje que extiende sus atributos del padre "Personaje"
class Guerrero extends Personaje {
  // Constructor y datos que se reciben
  constructor(nombre) { // recibimos el nombre del personaje indicado por el jugador
    super(nombre, 'Guerrero'); // Llamamos a la super clase y le pasamos el nombre y al tipo de personaje

    // Asignacion de atribibutos especiales de la subclase
    this.salud += 10; // Mayor salud inicial a la de las demas subclases
    this.defensaFisica += 2; // Mayor resistencia fisica a la de las demas subclases 
    // Asignacion de habilidades especiales de la subclase para mostrar en menus y conectar segun corresponda
    this.habilidades = [
      'Ataque básico',
      'Furia',
      'Grito defensivo',
      'Usar objeto' // Esta habilidad se conecta con la superclase Personaje ya que es una habilidad que todos los tipos de personaje tienen
    ];
  }
  // Metodos *****************************************************************************************************************************

  // Metodo para usar habilidad el cual descenraliza la responzabilidad de ejecutar los ataques y los ejecuta de manera correcta
  usarHabilidad(nombre) {
    switch (nombre) {
      case 'Ataque básico':
        return this.usarAtaqueBasico();
      case 'Furia':
        return this.usarFuria();
      case 'Grito defensivo':
        return this.usarGritoDefensivo();
      case 'Usar objeto':
        return 'Objeto usado';
      default:
        return 'Habilidad no reconocida'; // Opcion de descarte para fallas en el menu
    }
  }

    // Metodo para habilidad especial 'Ataque básico'
    usarAtaqueBasico() {
        let danio = 3; // Daño basico de la habilidad

        // Validacion de modificadores
        const modificadores = this.inventario.getModificadoresPara('Ataque básico', 'fisico'); // Validar si algun item de inventario modifica tipo de ataque o habilidad especifica
        modificadores.forEach(modificador => { // Ciclo para aplicar modificadores segun corresponde
            if (modificador.tipo === 'daño' && modificador.modo === 'aumentar') { // Validacion de condicion para activar efecto
            danio += modificador.valor; // Aplicacion de bonificacion de efecto
            }
        });

        // Validacion de modificadores de estados temporales
        if (this.tieneEfecto('daño_doble')) { // Validacion de efecto 
            const efecto = this.efectosTemporales.find(efecto => efecto.nombre === 'daño_doble'); // Validacion de nobre del efecto
            const debeActivarse = efecto.modo === 'garantizado' || Math.random() < 0.5; // Aleatoriedad de doble daño

            if (debeActivarse) { // si se tiene efecto garantizado
            danio *= 2;
            }

            this.consumirEfecto('daño_doble'); // Metodo para consumir el efecto que ya se uso 
        }

        return `${this.nombre} ataca con fuerza causando ${danio} de daño.`; // Mensaje de el daño efectuado con el ataque
    }

    // Metodo para habilidad especial 'Furia'
    usarFuria() {

        // Verificamos si tiene objeto que modifica la habilidad
        const tieneObjeto = this.inventario.getModificadoresPara('Furia') 
        .some(modificador => modificador.tipo === 'daño' && modificador.valor >= 1);

        // Validacion para mejorar efecto temporal
        if (tieneObjeto) {
            this.aplicarEfectoTemporal({ nombre: 'daño_doble', duracion: 1, modo: 'garantizado'});
            return `${this.nombre} toca el Cuerno de Guerra: ¡el próximo ataque hará daño doble garantizado!`;
        } else {
            this.aplicarEfectoTemporal({ nombre: 'daño_doble', duracion: 1, modo: 'probable' });
            return `${this.nombre} entra en furia: el próximo ataque podría hacer doble daño.`;
        }
    }

  // Metodo para habilidad especial 'Grito defensivo'  
  usarGritoDefensivo() {
    let reduccion = 50; // reduccion base del efecto 

        // Validacion de modificadores
        const modificadores = this.inventario.getModificadoresPara('defensa', 'aumentar'); // Validar si algun item de inventario modifica tipo de ataque o habilidad especifica
        modificadores.forEach(modificador => { // Ciclo para aplicar modificadores segun corresponde
            if (modificador.tipo === 'defensa' && modificador.modo === 'aumentar') { // Validacion de condicion para activar efecto
            reduccion += modificador.valor; // Aplicacion de bonificacion de efecto
            }
        });
    return `${this.nombre} lanza un grito defensivo. El siguiente ataque físico se reduce en un ${reduccion}%.`;
  }
}

module.exports = Guerrero;
