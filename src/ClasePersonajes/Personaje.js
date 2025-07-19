// Zona de importaciones ********************************************************************************************************************************
const { v4: uuidv4 } = require('uuid'); //Funcion para generar Id unico por personaje para asi manejar mejor el control de cada uno
const Inventario = require('../ClaseInventario/Inventario');  // Clase inventario ya que cada perosnaje va a tener su propio inventario independiente


// Creacion de clase Personaje: Instanciada ya que no se puede crear un personaje, solo heredar para las subclases: Guerrero, Arquero y mago.
class Personaje {
  // Constructor y datos que se reciben; inicializamos nivel en 1 por defecto  
  constructor(nombre, tipo, nivel = 1) {
    // Forzamos que no se pueda crear directamnete la clase Personaje, si no que debe ser llamada por subclases
    if (this.constructor === Personaje) {
      throw new Error("El personaje enviado no es del tipo (Personaje)");
    }
    // Asignacion de atributos basicos
    this.id = uuidv4(); // Id unico de personaje
    this.nombre = nombre; // No,mbre del personaje puesto por el jugador
    this.tipo = tipo; // Sera la subclase elejida: Guerrero, Mago o arquero
    this.nivel = nivel; // Asignamos nivel inicializado en 1 por defecto

    // Asignacion de atributos de estadisticas iniciales escalables a futuro segun los metodos ejecutados
    this.saludMaxima = 100 + (nivel - 1) * 10; 
    this.salud = this.saludMaxima;
    this.ataque = 10 + (nivel - 1) * 2;
    this.defensaFisica = 5;
    this.defensaMagica = 5;
    this.efectosTemporales = []; // Efectos temporales que se aplican por habilidades o objetos
    this.absorcionesPendientes = 0; // para efectos de absorciones completas de daños (Reflejo del mago)

    // Relacion bidireccional con inventario ya que debo crear un objeto inventario vacio para iniciar el personaje
    this.inventario = new Inventario();
  }

  // Metodos *******************************************************************************************************************************

  // Forzamos metodo abstracto ya que cada subclase va a definir como atacar por aparte a su manera especifica
  atacar(objetivo) {
    throw new Error("Método 'atacar' debe ser implementado en subclases");
  }

  // Metodo para recibir daño 
  recibirDanio(cantidad, tipo = 'fisico') {  // recibimos la cantidad de daño, el tipo de daño por defecto fisico
  // Verifica absorciones completas de daños
  if (this.absorcionesPendientes > 0) {
    this.absorcionesPendientes -= 1;
    console.log(`${this.nombre} ha absorbido completamente el daño con Reflejo. Le quedan ${this.absorcionesPendientes} cargas.`);
    return;
  }
    let defensa = tipo === 'magico' ? this.defensaMagica : this.defensaFisica; // Condicional para elegir el tipo de defensa que se usara para el ataque especifico que se recibira
    const danioReal = Math.max(cantidad - defensa, 0); // Calculo de daño real que se recibo restando la defensa usada difernte para cada personaje.
    this.salud -= danioReal; // se resta el daño recibido con la salud del personaje
    if (this.salud < 0) this.salud = 0; // condicional par varificar si aun le queda vida al personaje o bajo de cero y "Murio"
    console.log(`${this.nombre} recibió ${danioReal} de daño (${tipo})`); // mensjae en consola de cuando daño y de que tipo se recibio
  }
  
  // Metodo para subir de nivel -> todos los personajes suben estadisticas al subir de nivel, lo que diferencia es las estadistiocas base por clase
  subirNivel() {
    this.nivel += 1;
    this.saludMaxima += 10;
    this.salud = this.saludMaxima;
    this.ataque += 2;
    console.log(`${this.nombre} ha subido al nivel ${this.nivel}`); // Mensaje de que se subio de nivel y a que nivel se subio
  }

  // Metodo para usar obgetos -> el inventario se encargara de activar los efectos segun el objeto usado
  usarObjeto(nombreObjeto) {
    if (!this.inventario) return;
    this.inventario.usarPocion(nombreObjeto, this);
  }

  // Metodo para cambiar de objeto activo por otro que tenga en inventario
  cambiarEquipo(nombreObjeto) {
    if (!this.inventario) return;
    return this.inventario.cambiarEquipo(nombreObjeto);
  }

  // Metodo para crear por defecto las habilidades vacias, cada subclase se encarga de llenarlo con sus habilidades especificas
  getHabilidades() {
    return [];
  }

  // Metodo para verificar si el personaje esta vivo
  estaVivo() {
    return this.salud > 0;
  }

  // Metodo para devolver los equipos actualmente para modificar habilidades
  getEquipamiento() {
    return this.inventario.getEquipados();
  }

  // Metodo para aplicar efectos temporales
  aplicarEfectoTemporal(efecto) {
    this.efectosTemporales.push(efecto); // Pushear efecto a efectos temporales
  }

  // Metodo para verificar el efecto y el nombre del efecto si se tiene 
  tieneEfecto(nombre) {
    return this.efectosTemporales.some(efecto => efecto.nombre === nombre);
  }

  // Metodo para consumir el efecto temporal
  consumirEfecto(nombre) {
    this.efectosTemporales = this.efectosTemporales.filter(efecto => efecto.nombre !== nombre);
  }

  // Metodo para validar y aplicar modificacodres
  getModificadoresPara(habilidad = null, tipoDanio = null) {
  const equipados = this.getEquipamiento(); // Obtenemos objetos equipados
  let modificadores = [];

  equipados.forEach(obj => {
    if (obj.modificadores && Array.isArray(obj.modificadores)) {
      obj.modificadores.forEach(mod => {
        const afecta = mod.afecta || {};

        // Filtros por habilidad y tipo de daño
        const coincideHabilidad = habilidad ? afecta.habilidad === habilidad : true;
        const coincideTipoDanio = tipoDanio ? afecta.tipoDanio === tipoDanio : true;

        if (coincideHabilidad && coincideTipoDanio) {
          modificadores.push(mod);
        }
      });
    }
  });

  return modificadores;
}
}

// Zona de exportaciones *********************************************************************************************************************************
module.exports = Personaje;