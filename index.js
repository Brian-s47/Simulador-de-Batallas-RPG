const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const { Low, JSONFile } = require('lowdb');

const Guerrero = require('./src/ClasePersonajes/Guerrero');
const Arquero = require('./src/ClasePersonajes/Arquero');
const Mago = require('./src/ClasePersonajes/Mago');
const Objeto = require('./src/ClaseInventario/Objeto');

const {
  serializarPersonaje,
  deserializarPersonaje,
  guardarPersonaje,
  eliminarPersonaje
} = require('./utils/personajeUtils');

// 📁 Base de datos
const dbPath = path.join(__dirname, 'data', 'personajes.json');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const adapter = new JSONFile(dbPath);
const db = new Low(adapter);

// 📦 Objetos disponibles
const objetosDisponibles = require('./data/objetos.json');

// 🧠 Inicializar base de datos
async function initDB() {
  await db.read();
  db.data ||= { personajes: [] };
  await db.write();
}

// 🎮 Menú principal
async function main() {
  await initDB();

  const { accion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'accion',
      message: '¿Qué deseas hacer?',
      choices: ['Crear personaje', 'Ver personajes', 'Salir'],
    }
  ]);

  if (accion === 'Crear personaje') {
    await crearPersonaje();
  } else if (accion === 'Ver personajes') {
    await mostrarPersonajes();
  } else {
    console.log('👋 ¡Hasta luego!');
    process.exit();
  }
}

// 🧙‍♂️ Crear personaje nuevo
async function crearPersonaje() {
  const { nombre, tipo } = await inquirer.prompt([
    {
      type: 'input',
      name: 'nombre',
      message: 'Nombre del personaje:',
    },
    {
      type: 'list',
      name: 'tipo',
      message: 'Elige la clase:',
      choices: ['Guerrero', 'Arquero', 'Mago'],
    }
  ]);

  let personaje;

  if (tipo === 'Guerrero') {
    personaje = new Guerrero(nombre);
  }

  if (tipo === 'Arquero') {
    const { defensa } = await inquirer.prompt({
      type: 'list',
      name: 'defensa',
      message: '¿Qué defensa adicional quieres?',
      choices: ['fisica', 'magica']
    });
    personaje = new Arquero(nombre, defensa);
  }

  if (tipo === 'Mago') {
    personaje = new Mago(nombre);
  }

  // 🎒 Selección de 2 objetos iniciales
  const opcionesIniciales = objetosDisponibles.filter(obj =>
    obj.disponible && (obj.tiposPermitidos.includes(tipo) || obj.tiposPermitidos.includes('Todos'))
  );

  const { seleccionObjetos } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'seleccionObjetos',
      message: 'Elige 2 objetos iniciales:',
      choices: opcionesIniciales.map(o => ({ name: o.nombre, value: o })),
      validate: (respuesta) => {
        if (respuesta.length !== 2) {
          return 'Debes seleccionar exactamente 2 objetos.';
        }
        return true;
      }
    }
  ]);

  // ➕ Agregar objetos al inventario
  seleccionObjetos.forEach(obj => {
    const instancia = new Objeto(obj);
    personaje.inventario.agregarObjeto(instancia);
    if (instancia.tipo === 'equipo') {
      personaje.inventario.cambiarEquipo(instancia.nombre); // 🔁 aquí usás el nombre del objeto real
    }
  });

  // 💾 Guardar personaje
  await guardarPersonaje(personaje);
  console.log(`✅ Personaje "${nombre}" creado y guardado correctamente.\n`);
  await main();
}

// 📋 Ver personajes guardados
async function mostrarPersonajes() {
  await db.read();

  if (!db.data.personajes.length) {
    console.log('\n❌ No hay personajes guardados.\n');
    return await main();
  }

  console.log('\n📋 Lista de personajes:\n');

  db.data.personajes.forEach((p, i) => {
    console.log(`${i + 1}. ${p.nombre} (${p.tipo}) - Nivel ${p.nivel}`);
  });

  console.log('');
  await main();
}

// 🚀 Iniciar
main();
