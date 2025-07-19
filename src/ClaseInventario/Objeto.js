// Creacion de clase Objeto: Esta representa todos tipo de objetos que los personaje spodran tener como: armas, pociones, escudos, tomos, etc. 
class Objeto {
  // Constructor recibimos los datos completos del objeto que crearemos estos vendran de los archivos json en data, ya sea de objetos.json o de personajes.json 
  constructor(data) {
    this.nombre = data.nombre; // Nombre del objeto
    this.tipo = data.tipo; // Tipo de objeto: Equipo o consumible como la pocion
    this.manos = data.manos || 0; // Asignamos la catindad de manos para el equipo ejemplo una mano para espada de una mano, 2 manos para baaculo o por defecto cero para las pociones que no se equipan en manos, solo se consumen directo dle inventario
    this.tiposPermitidos = data.tiposPermitidos || []; // Recibe los tipos de persoanje que pueden usar este equipo, ejemplo arquero, mago o guerrero, o todos.
    this.disponible = data.disponible ?? true; // Estado disponible o no con boleano por defecto true cuando recien se crea el perosnaje pro se modificara con la accion de cambiar equipo que se implementara mas adelante
    this.modificadores = data.modificadores || []; // guada los modificadores efectos y del arma si no tiene por defecto lo pone vacio
  }

  // Metodo para convertir el archivo en un formato de JSON plano y asi poder guardarlo en el archivo de ese tipo 
  serializar() {
    return {
      nombre: this.nombre,
      tipo: this.tipo,
      manos: this.manos,
      tiposPermitidos: this.tiposPermitidos,
      disponible: this.disponible,
      modificadores: this.modificadores
    };
  }
}

// Zona de exportaciones *********************************************************************************************************************************
module.exports = Objeto;
