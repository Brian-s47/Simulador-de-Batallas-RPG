const path = require('path');
const { Low, JSONFile } = require('lowdb');

const Guerrero = require('../src/ClasePersonajes/Guerrero');
const Arquero = require('../src/ClasePersonajes/Arquero');
const Mago = require('../src/ClasePersonajes/Mago');
const Inventario = require('../src/ClaseInventario/Inventario');

// 🧩 Base de datos
const dbPath = path.join(__dirname, '../data/personajes.json');
const adapter = new JSONFile(dbPath);
const db = new Low(adapter);

// 🧪 Cargar objetos disponibles (para reconstruir inventarios)
const objetosDisponibles = require('../data/objetos.json');

// 🔁 Serializar personaje para guardar en JSON
function serializarPersonaje(personaje) {
  return {
    id: personaje.id,
    nombre: personaje.nombre,
    tipo: personaje.tipo,
    nivel: personaje.nivel,
    salud: personaje.salud,
    saludMaxima: personaje.saludMaxima,
    ataque: personaje.ataque,
    defensaFisica: personaje.defensaFisica,
    defensaMagica: personaje.defensaMagica,
    efectosTemporales: personaje.efectosTemporales || [],
    inventario: personaje.inventario.serializar()
  };
}

// 🔁 Deserializar personaje desde JSON con su inventario reconstruido
function deserializarPersonaje(data) {
  let personaje;

  switch (data.tipo) {
    case 'Guerrero':
      personaje = new Guerrero(data.nombre);
      break;
    case 'Arquero':
      personaje = new Arquero(data.nombre);
      break;
    case 'Mago':
      personaje = new Mago(data.nombre);
      break;
    default:
      throw new Error(`Tipo de personaje desconocido: ${data.tipo}`);
  }

  // Restaurar estado
  personaje.id = data.id;
  personaje.nivel = data.nivel;
  personaje.salud = data.salud;
  personaje.saludMaxima = data.saludMaxima;
  personaje.ataque = data.ataque;
  personaje.defensaFisica = data.defensaFisica;
  personaje.defensaMagica = data.defensaMagica;
  personaje.efectosTemporales = data.efectosTemporales || [];

  // Reconstruir inventario
  personaje.inventario = Inventario.deserializar(data.inventario, objetosDisponibles);

  return personaje;
}

// 💾 Guardar personaje actualizado (por ID)
async function guardarPersonaje(personaje) {
  await db.read();
  db.data ||= [];

  const index = db.data.findIndex(p => p.id === personaje.id);
  const serializado = serializarPersonaje(personaje);

  if (index >= 0) {
    db.data[index] = serializado;
  } else {
    db.data.push(serializado);
  }

  await db.write();
  console.log(`✅ Personaje "${personaje.nombre}" guardado correctamente.`);
}

// ☠️ Eliminar personaje (por ID)
async function eliminarPersonaje(id) {
  await db.read();
  db.data ||= [];

  db.data = db.data.filter(p => p.id !== id);
  await db.write();
  console.log(`🗑️ Personaje eliminado correctamente.`);
}

// 📥 Cargar todos los personajes guardados
async function cargarPersonajes() {
  const dbPath = path.join(__dirname, '../data/personajes.json');
  const adapter = new JSONFile(dbPath);
  const db = new Low(adapter);
  await db.read();
  return db.data || [];
}

// 🧾 Exportar funciones
module.exports = {
  serializarPersonaje,
  deserializarPersonaje,
  guardarPersonaje,
  eliminarPersonaje,
  cargarPersonajes // ✅ ¡Ahora sí está exportada!
};
