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
  cargarPersonajes,
  guardarPersonaje,
  eliminarPersonaje,

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

// funcion de emnsake de bienvenida
function mostrarBienvenida() {
  console.clear();
  console.log(chalk.yellow.bold(`
╔════════════════════════════════════════════════════════════╗
║                🛡️  SIMULADOR DE BATALLAS RPG 🛡️              ║
╚════════════════════════════════════════════════════════════╝

Bienvenido, aventurero...

"${chalk.cyan('Simulador de Batallas RPG')}" es un juego de consola en el que 
tomarás el rol de un héroe legendario. Tendrás que elegir entre tres clases:

${chalk.redBright('• Guerrero')} — Maestro del combate cuerpo a cuerpo y defensor implacable contra ataques físicos.

${chalk.blueBright('• Mago')} — Dominador de las artes arcanas: fuego, hielo y poderosas ilusiones para alterar la realidad.

${chalk.greenBright('• Arquero')} — Estratega versátil, experto en daño a distancia y con afinidad tanto física como mágica.

Cada decisión te llevará más profundo a una antigua mazmorra repleta de enemigos,
trampas y tesoros. Cada nivel superado será recompensado, pero si caes en combate...

${chalk.red('¡No habrá segundas oportunidades!')} Tu historia terminará, y deberás forjar una nueva.

Prepárate para enfrentar lo desconocido, ascender de nivel, y escribir tu leyenda.

${chalk.bold('¿Qué camino elegirás? ¿La magia, la defensa o la estrategia?')}
El destino te espera...

`));
}
// Funcion para esperar a que el jugador inicie luego del mensaje de bienvenida presionando una tecla
async function esperarTecla() {
  await inquirer.prompt([
    {
      type: 'input',
      name: 'continuar',
      message: chalk.gray('\nPresiona Enter para continuar...'),
    }
  ]);
}


// 🎮 Menú principal
async function main() {
  mostrarBienvenida(); // Mostrar el mensaje de bienvenida con arte
  await esperarTecla();  // funcion para esperar y continuar

  await initDB();

  const { accion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'accion',
      message: chalk.cyan.bold('¿Qué deseas hacer?'),
      choices: [
        { name: chalk.green('✨ Crear personaje'), value: 'crear' },
        { name: chalk.blue('📜 Vacio para batallas :)'), value: 'nada' },
        { name: chalk.yellow('🔥  Gestionar personaje'), value: 'gestionar' },
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
  } else if (accion === 'gestionar') {
    console.log(chalk.yellowBright('\n🔧 Vamos a gestionar tus personajes...\n'));
    await gestionarPersonaje();
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

  // 🎒 Selección de objetos iniciales
  const { seleccionObjetos } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'seleccionObjetos',
      message: 'Selecciona 2 objetos iniciales:',
      choices: objetosDisponibles.map(obj => ({
        name: obj.nombre,
        value: obj.nombre
      })),
      validate: function (respuesta) {
        if (respuesta.length !== 2) {
          return 'Debes seleccionar exactamente 2 objetos.';
        }
        return true;
      }
    }
  ]);

  const objetosSeleccionados = seleccionObjetos.map(nombre => {
    const datos = objetosDisponibles.find(obj => obj.nombre === nombre);

    if (!datos) {
      console.error(`❌ No se encontró el objeto con nombre "${nombre}".`);
      return null;
    }

    return new Objeto(datos);
  }).filter(obj => obj !== null);

  // Agregar al inventario del personaje
  objetosSeleccionados.forEach(obj => {
    personaje.inventario.agregarObjeto(obj);

    if (obj.tipo === 'equipo') {
      personaje.inventario.cambiarEquipo(obj.nombre);
    }
  });

  // 💾 Guardar personaje
  await guardarPersonaje(personaje);

  // ✅ Confirmación
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


async function gestionarPersonaje() {
  const personajes = await cargarPersonajes();
  if (personajes.length === 0) {
    console.log("❌ No hay personajes para gestionar.");
    return;
  }

  // Selección del personaje
  const { seleccionado } = await inquirer.prompt({
    type: "list",
    name: "seleccionado",
    message: "Selecciona un personaje:",
    choices: personajes.map(p => `${p.nombre} (${p.tipo})`)
  });

  const personaje = personajes.find(p => `${p.nombre} (${p.tipo})` === seleccionado);

  // Opciones de gestión
  const { accion } = await inquirer.prompt({
    type: "list",
    name: "accion",
    message: `¿Qué deseas hacer con ${personaje.nombre}?`,
    choices: [
      "Ver detalles",
      "Cambiar nombre",
      "Eliminar personaje",
      "Volver"
    ]
  });

  if (accion === "Ver detalles") {
    console.log(JSON.stringify(personaje, null, 2));
  } else if (accion === "Cambiar nombre") {
    const { nuevoNombre } = await inquirer.prompt({
      type: "input",
      name: "nuevoNombre",
      message: "Ingresa el nuevo nombre:"
    });
    personaje.nombre = nuevoNombre;
    await guardarPersonajes(personajes); // usa función del personajeUtils
    console.log("✅ Nombre actualizado.");
  } else if (accion === "Eliminar personaje") {
    const { confirmacion } = await inquirer.prompt({
      type: "confirm",
      name: "confirmacion",
      message: `¿Estás seguro de eliminar a ${personaje.nombre}?`
    });

    if (confirmacion) {
      await eliminarPersonaje(personaje.id); // usa función de personajeUtils.js
      console.log("🗑️ Personaje eliminado.");
    }
  }

  await gestionarPersonaje(); // permite volver a gestionar otro personaje
}

// 🚀 Iniciar
main();





const goku = new Guerrero('Goku');

console.log(`Nivel inicial: ${goku.nivel}`);
goku.ganarExperiencia(120); // Esto debería subirlo al nivel 2
goku.ganarExperiencia(200); // Esto podría subirlo otro nivel según la fórmula