// Importamos la clase Objeto, que representa cada ítem que un personaje puede tener
const Objeto = require('./Objeto');

class Inventario {
  constructor(objetosData = []) {
    // Creamos instancias de Objeto a partir de los datos recibidos
    this.objetos = objetosData.map(data => new Objeto(data));

    // Al iniciar, separamos los objetos que están equipados
    this.objetosEquipados = this.objetos.filter(obj => !obj.disponible);
  }
  // Devuelve una lista de todos los objetos
  listarObjetos() {
    return this.objetos;
  }
  // Devuelve los objetos actualmente equipados
  listarEquipados() {
    return this.objetosEquipados;
  }
  // Equipar un objeto si está disponible
  equiparObjeto(nombreObjeto) {
    const objeto = this.objetos.find(obj => obj.nombre === nombreObjeto);

    if (!objeto) {
      throw new Error(`Objeto "${nombreObjeto}" no encontrado en el inventario.`);
    }

    if (!objeto.disponible) {
      throw new Error(`El objeto "${nombreObjeto}" ya está equipado.`);
    }

    objeto.disponible = false;
    this.objetosEquipados.push(objeto);
  }
  // Desequipar un objeto
  desequiparObjeto(nombreObjeto) {
    const objeto = this.objetosEquipados.find(obj => obj.nombre === nombreObjeto);

    if (!objeto) {
      throw new Error(`El objeto "${nombreObjeto}" no está equipado.`);
    }

    objeto.disponible = true;
    this.objetosEquipados = this.objetosEquipados.filter(obj => obj.nombre !== nombreObjeto);
  }
  // Cambiar de equipo: desequipa el actual del mismo tipo/manos y equipa el nuevo
  cambiarEquipo(nombreObjeto) {
    const objetoNuevo = this.objetos.find(obj => obj.nombre === nombreObjeto);

    if (!objetoNuevo) {
      throw new Error(`El objeto "${nombreObjeto}" no se encuentra en el inventario.`);
    }

    if (objetoNuevo.tipo === 'equipo') {
      // Desequipa objetos del mismo número de manos (ej: reemplazar un arma de 2 manos)
      const mismosManos = this.objetosEquipados.filter(obj => obj.tipo === 'equipo' && obj.manos === objetoNuevo.manos);
      mismosManos.forEach(obj => this.desequiparObjeto(obj.nombre));
    }

    this.equiparObjeto(nombreObjeto);
  }
  // Usa una poción del inventario sobre el personaje
  usarPocion(nombreObjeto, personaje) {
    const pocion = this.objetos.find(obj => obj.nombre.toLowerCase() === nombreObjeto.toLowerCase() && obj.tipo === 'pocion' && obj.disponible);

    if (!pocion) {
      console.log(`❌ No se encontró una poción disponible con el nombre "${nombreObjeto}".`);
      return;
    }

    const modificador = pocion.modificadores.find(mod => mod.tipo === 'curacion' && mod.modo === 'aumentar');

    if (!modificador) {
      console.log(`⚠️ La poción "${pocion.nombre}" no tiene un efecto de curación válido.`);
      return;
    }

    const porcentajeCuracion = modificador.valor;
    const cantidadCurada = Math.floor(personaje.saludMaxima * porcentajeCuracion);

    personaje.salud += cantidadCurada;
    if (personaje.salud > personaje.saludMaxima) personaje.salud = personaje.saludMaxima;

    console.log(`🧪 ${personaje.nombre} consumió "${pocion.nombre}" y recuperó ${cantidadCurada} puntos de salud.`);

    // Eliminar la poción del inventario (simulando consumo)
    this.objetos = this.objetos.filter(obj => obj !== pocion);
  }
  // Serializar inventario para guardarlo en JSON
  serializar() {
    return this.objetos.map(obj => obj.serializar());
  }
  agregarObjeto(dataObjeto) {
    const nuevoObjeto = new Objeto(dataObjeto);
    this.objetos.push(nuevoObjeto);

    // Si no está disponible (es decir, viene ya equipado), lo agregamos al array de equipados
    if (!nuevoObjeto.disponible) {
      this.objetosEquipados.push(nuevoObjeto);
    }
  }
    // Método estático para reconstruir el inventario desde datos planos
  static deserializar(objetosPlano, objetosDisponibles) {
    const objetosReconstruidos = objetosPlano.map(objData => {
      const dataOriginal = objetosDisponibles.find(o => o.nombre === objData.nombre);
      if (!dataOriginal) {
        console.warn(`⚠️ Objeto "${objData.nombre}" no encontrado en objetosDisponibles. Se usará data parcial.`);
        return objData;
      }

      return {
        ...dataOriginal,
        ...objData
      };
    });

    return new Inventario(objetosReconstruidos);
  }
    // Devuelve modificadores activos aplicables a una habilidad o tipo de daño
  getModificadoresPara(habilidad = null, tipoDanio = null) {
    let modificadores = [];

    this.objetosEquipados.forEach(obj => {
      if (obj.modificadores && Array.isArray(obj.modificadores)) {
        obj.modificadores.forEach(mod => {
          const afecta = mod.afecta || {};
          const coincideHabilidad = habilidad ? afecta.habilidad === habilidad : true;
          const coincideTipo = tipoDanio ? afecta.tipoDanio === tipoDanio : true;

          if (coincideHabilidad && coincideTipo) {
            modificadores.push(mod);
          }
        });
      }
    });

    return modificadores;
  }
  // Devuelve todos los objetos actualmente equipados (compatibilidad con Personaje)
  getEquipados() {
    return this.objetosEquipados;
  }
}
// Exportamos la clase Inventario para ser usada por los personajes
module.exports = Inventario;
