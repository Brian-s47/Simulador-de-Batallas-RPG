// Zona de importaciones ********************************************************************************************************************************
const Objeto = require('./Objeto'); // importamos clase Objeto ya que de ella  crearemos para manipular el inventario de forma activa
const inquirer = require('inquirer'); // Libreria para poder implementar preguntas por consola


// Creacion de clase Inventario: trae la super clase objetos para manipularlos
class Inventario { 
  // Constructor y datos de los objetos que tiene el personaje actualmente
  constructor() { 
    this.objetos = []; // objetos actuales en inventario de cualquier estado
    this.equipados = []; // objetos actuales en inventario en etsado equipados disponibles para uso y activacion de efectos
  }

  // Metodos *******************************************************************************************************************************

  // Metodo para agregar objetos este se llama cuando se crea personaje o en un futuro al ganar batallas y subir de nivel
  agregarObjeto(objeto) {
    this.objetos.push(objeto);
  }

  // Metodo para cambiar objetos en el inventario y equiparlos
  async cambiarEquipo(nombreObjeto) { // debe ser async ya que esto lo preguntaremos por consola para elejis opciones segun las respuestas del jugador
    const objeto = this.objetos.find(obj => obj.nombre === nombreObjeto); // traemos el nombre del objeto
    if (!objeto || objeto.tipo !== 'equipo') { // varificamos que sea de tipo equipo
      console.log(`El objeto "${nombreObjeto}" no es equipable.`);
      return false;
    }
    // Logica para validar disponibilidad de manos en personaje
    const totalManosOcupadas = this.equipados.reduce((total, obj) => total + obj.manos, 0); // Traemos el total de manos ocupadas
    const manosDisponibles = 2 - totalManosOcupadas; // Validamos la cantidad de manos disponibles

if (objeto.manos > manosDisponibles) { // condicional para validar que no tiene manos disponibles
    console.log(`No tienes manos suficientes para equipar "${objeto.nombre}".`);

    // Mostramos los objetos equipados actualmente para dar opciones de cambio al jugador
    console.log('Objetos equipados actualmente:'); 
    this.equipados.forEach((equipo, i) => { // ciclo para mostrar todos lo items
      console.log(` ${i + 1}. ${equipo.nombre} (${equipo.manos} mano/s)`);
    });


    // menu para jugador par dar la opcion de reemplazar algun equipo
    const { deseaReemplazar } = await inquirer.prompt({
      type: 'confirm',
      name: 'deseaReemplazar',
      message: `¿Quieres reemplazar uno o más objetos para equipar "${objeto.nombre}"?`,
      default: false
    });

    // Condicional si desea o no reemplazar
    if (!deseaReemplazar) return false;

    // menu para jugador para que seleccione el equipo que desea reemplazar
    const { seleccion } = await inquirer.prompt({
      type: 'checkbox',
      name: 'seleccion',
      message: 'Selecciona qué objetos deseas desequipar:',
      choices: this.equipados.map(equipo => ({ name: `${equipo.nombre} (${equipo.manos} mano/s)`, value: equipo.nombre }))
    });

    // seleccionar la coincidencia del equipo seleccionado para retirar en el inventario actial de equipados
    this.equipados = this.equipados.filter(equipo => !seleccion.includes(equipo.nombre));

    // Logica para validar la nueva cantidad de manos disponibles para equipar
    const nuevasManosOcupadas = this.equipados.reduce((total, obj) => total + obj.manos, 0);
    const nuevasManosDisponibles = 2 - nuevasManosOcupadas;

    // condicional para validar la nueva cantidad de manos disponibles con el objeto a equipar
    if (objeto.manos > nuevasManosDisponibles) {
      console.log(`Aun no tienes manos suficientes para equipar "${objeto.nombre}".`);
      return false;
    }
  }

    // Logica si el equipo seleccionado ya esta equipado
    const yaEquipado = this.equipados.find(equipo => equipo.nombre === objeto.nombre);
    if (yaEquipado) {
      console.log(`El objeto "${objeto.nombre}" ya está equipado.`);
      return false;
    }
    //logica para equipar el objeto seleccional y mostrarlo al jugador
    this.equipados.push(objeto);
    console.log(`Equipaste "${objeto.nombre}".`);
    return true;
  }

  // Metodo para traer los equipos actuakmente equipados
  getEquipados() {
    return this.equipados;
  }

  // Metodo para usar pociones
  usarPocion(nombreObjeto, personaje) { // recibimos el nombre dle objeto y el personaje
    const objeto = this.objetos.find(o => o.nombre === nombreObjeto && o.tipo === 'pocion');

    // Condicional para si no tiene pociones
    if (!objeto) {
      console.log(`No tienes la poción "${nombreObjeto}".`);
      return;
    }

    // Logica para efecto de curacion de posciones agrega el modificador
    const efectoCuracion = objeto.modificadores.find(mod => mod.tipo === 'curacion');

    //condicional para efecto de curacion si se tiene esemodificador
    if (efectoCuracion) {
      const curado = Math.floor(personaje.saludMaxima * efectoCuracion.valor); // calcula el valor que va a curar
      personaje.salud = Math.min(personaje.salud + curado, personaje.saludMaxima); // aplica la curacion correspondiente al personaje
      console.log(`${personaje.nombre} se curó ${curado} puntos de salud.`); // mensjae para que el jugador sepa cuanto se curo
    }

    // Eliminacion de posion de curar de inventario
    this.objetos = this.objetos.filter(o => o !== objeto);
  }

  // Metodo para obtener los modificadores del inventario. este es llamado por las habilidades de las subclases de personajes
  getModificadoresPara(habilidad, tipoDanio) { // recibimos la habilidad y el tipo de daño
    const modificadores = []; // creamos variable para guardar los modificadores

    for (const obj of this.equipados) { // ciclo para verificar todos objetos equipados del inventario inventario
      if (!obj.modificadores) continue; // condicional para verificar que si tengamos modificadores

      for (const mod of obj.modificadores) { // Ciclo para sacar cada modificador de los objetos del inventario
        const afecta = mod.afecta || {}; // guardamos a que afecta si no tiene por defecto vacio
        const coincideHabilidad = !afecta.habilidad || afecta.habilidad === habilidad; // validamos que Habiliad afecta 
        const coincideTipo = !afecta.tipoDanio || afecta.tipoDanio === tipoDanio; // calidamos que tipo de daño afecta

        if (coincideHabilidad && coincideTipo) { // condicional para que el modificador se active
          modificadores.push(mod); // alegramos el modificador a los modificadores actuales
        }
      }
    }
    // Devolvemos los modificadores cuando los llamen en este metodo
    return modificadores;
  }

  // Metodo para convetir un inventario completo en un Objeto JSON guardable con la libreria
  serializar() { 
    return { // devolvemos los objetos en mapeo para que se puedan convertir 
      objetos: this.objetos.map(obj => ({
        nombre: obj.nombre,
        tipo: obj.tipo,
        manos: obj.manos,
        tiposPermitidos: obj.tiposPermitidos,
        disponible: obj.disponible,
        modificadores: obj.modificadores || []
      })), // en el caso de los equipados solo el nombre para luego reconstruirlos al sacarlos 
      equipados: this.equipados.map(obj => obj.nombre)
    };
  }

  // Metodo estatico para reconstruir los objetos gurdados en los archivos JSON 
  static deserializar(data, objetosDisponibles) { // recibimos los datos y los disponibles
    const inv = new Inventario(); // creamos un objeto Inventario completo actual 

    // convercion de los objetos del inventario por cada objeto trae sus datos ye crea su objeto correspondiente
    inv.objetos = data.objetos.map(objRaw => {
      const base = objetosDisponibles.find(o => o.nombre === objRaw.nombre);
      return new Objeto(base || objRaw); // debolvemos el objeto convertido
    });

    // Requipar desde los objetos ya añadidos
    data.equipados.forEach(nombre => {
      const obj = inv.objetos.find(o => o.nombre === nombre);
      if (obj) {
        inv.equipados.push(obj);
      }
    });

    return inv; // retornamos el inventario
  }
}

module.exports = Inventario;
