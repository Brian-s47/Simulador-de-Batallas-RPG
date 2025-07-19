const inquirer = require('inquirer');
const fs = require('fs');
const chalk = require('chalk');
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

// 🎨 Función para mostrar el mensaje de bienvenida con arte ASCII
function mostrarBienvenida() {
  console.clear();
console.log(chalk.yellow.bold(`
╔══════════════════════════════════════════╗
║     🛡️  SIMULADOR DE BATALLAS RPG 🛡️       ║
╚══════════════════════════════════════════╝

  Elige tu destino: Guerrero, Mago o Arquero  
Prepárate para la batalla más grande de tu vida...
`));
}

// 🎮 Menú principal
async function main() {
  mostrarBienvenida(); // Mostrar el mensaje de bienvenida con arte

  await initDB();

  const { accion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'accion',
      message: chalk.cyan.bold('¿Qué deseas hacer?'),
      choices: [
        { name: chalk.green('✨ Crear personaje'), value: 'crear' },
        { name: chalk.blue('📜 Ver personajes'), value: 'ver' },

        { name: chalk.red('❌ Salir'), value: 'salir' }
      ],
    }
  ]);

  if (accion === 'crear') {
    console.log(chalk.greenBright('\n🔨 Vamos a crear un nuevo personaje...\n'));
    await crearPersonaje();
  } else if (accion === 'ver') {
    console.log(chalk.blueBright('\n📖 Aquí están los personajes guardados:\n'));
    await mostrarPersonajes();
  } else {
    console.log(chalk.redBright('\n👋 ¡Hasta luego, aventurero!\n'));
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
console.log(chalk.red.bold(`
      ,   A           {}
     / \\, | ,        .--.
    |    =|= >      /.--.\\
     \\ / \` | \`      |====|
      \`   |         |\`::\`|
          |     .-;\\..../\`;-.
         /\\\\ /  |...::...|  \\
         |:'\\ |   /'''::'''\\   |
          \\ /\\;-,/\\   ::   /\\--;     
          |\\ <\` >  >._::_.<,<__>
          | \`""\`  /   ^^   \\|  |
          |       |        |\\::/
          |       |        |/|||
          |       |___/\\___| '''
          |        \\_ || _/
          |        <_ >< _>
          |        |  ||  |
          |        |  ||  |
          |       _\\.:||:./_
          |      /____/\\____\\
`));
    personaje = new Guerrero(nombre);
  }

  if (tipo === 'Arquero') {
console.log(chalk.green.bold(`
           ,       ,
          /(       )\\
         (  \\___/  )
         |  (_)  (_)\\
         \\    _|    |
         /\\__/   \\__/\\
        /__|     |__\\
         | |  |  | |
         |_|  |  |_|
         |||  |  |||    🏹
         |||  |  |||   /|
         | |  |  | |  / |
         |_|__|__|_| /__|
        (__)      (__)
     ===/  \\\\====//  \\\\===
        ||       ||
        ||       ||
     __/||__   __||\\__
    (______) (______)
   ARQUERO SOMBRA — El acechador del bosque oscuro
`));
    const { defensa } = await inquirer.prompt({
      type: 'list',
      name: 'defensa',
      message: '¿Qué defensa adicional quieres?',
      choices: ['fisica', 'magica']
    });
    personaje = new Arquero(nombre, defensa);
  }

  if (tipo === 'Mago') {
    console.log(chalk.blueBright.bold(String.raw`
          ____      
        .'* *.'
     __/_*_*(_
    / _______ \\
   _\\_)/___\\(_/_ 
  / _((\\- -/))_ \\
  \\ \\())(-)(()/ /
   ' \\(((()))/ '
  / ' \\)).))/ ' \\
 / _ \\ - | - /_  \\
(   ( .;''';. .'  )
_'._.)' .'.' )_.'
  /_/   |_|   \_\\
   MAGO MÍSTICO  
    `));
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
      personaje.inventario.cambiarEquipo(instancia.nombre);
    }
  });

  // 💾 Guardar personaje
  await guardarPersonaje(personaje);

  // ✅ Mensaje personalizado de confirmación
  console.log(chalk.yellowBright.bold(`\n✅ ¡El personaje de clase ${chalk.magenta(tipo)} llamado ${chalk.cyan(nombre)} ha sido creado exitosamente!\n`));

  await main();
}

// 📋 Ver personajes guardados
async function mostrarPersonajes() {
  await db.read();

  const personajes = db.data.personajes || [];

  if (!personajes.length) {
    console.log('\n❌ No hay personajes guardados.\n');
    return await main();
  }

  console.log('===='.repeat(20));
  console.log('📋 Lista de personajes:\n');

  personajes.forEach((p, i) => {
    console.log(`${i + 1}. ${p.nombre} (${p.tipo}) - Nivel ${p.nivel}`);
  });

  console.log('===='.repeat(20) + `\n`);
  await main();
}

// 🚀 Iniciar
main();