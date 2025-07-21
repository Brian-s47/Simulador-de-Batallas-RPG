const inquirer = require("inquirer");
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const { Low, JSONFile } = require("lowdb");
const crearPersonaje = require("./utils/crearPersonajes");
const gestionarPersonaje = require("./utils/gestionarPersonajes");

const Guerrero = require("./src/ClasePersonajes/Guerrero");
const Arquero = require("./src/ClasePersonajes/Arquero");
const Mago = require("./src/ClasePersonajes/Mago");
const Objeto = require("./src/ClaseInventario/Objeto");


// 📁 Base de datos
const dbPath = path.join(__dirname, "data", "personajes.json");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const adapter = new JSONFile(dbPath);
const db = new Low(adapter);

// 📦 Objetos disponibles
const objetosDisponibles = require("./data/objetos.json");

// 🧠 Inicializar base de datos
async function initDB() {
  await db.read();
  db.data ||= [];
  await db.write();
}

// funcion de emnsake de bienvenida
function mostrarBienvenida() {
  console.clear();
  console.log(
    chalk.yellow.bold(`
╔════════════════════════════════════════════════════════════╗
║             🛡️  LA TORRE DE LOS TRES CAMINOS 🛡️              ║
╚════════════════════════════════════════════════════════════╝

Bienvenido, aventurero...

"${chalk.cyan("La Torre de los Tres Caminos")}" es un juego de consola en el que 
tomarás el rol de un héroe legendario. Tendrás que elegir entre tres clases:

${chalk.redBright(
      "• Guerrero"
    )} — Maestro del combate cuerpo a cuerpo y defensor implacable contra ataques físicos.

${chalk.blueBright(
      "• Mago"
    )} — Dominador de las artes arcanas: fuego, hielo y poderosas ilusiones para alterar la realidad.

${chalk.greenBright(
      "• Arquero"
    )} — Estratega versátil, experto en daño a distancia y con afinidad tanto física como mágica.

Cada decisión te llevará más profundo a una antigua mazmorra repleta de enemigos,
trampas y tesoros. Cada nivel superado será recompensado, pero si caes en combate...

${chalk.red(
      "¡No habrá segundas oportunidades!"
    )} Tu historia terminará, y deberás forjar una nueva.

Prepárate para enfrentar lo desconocido, ascender de nivel, y escribir tu leyenda.

${chalk.bold("¿Qué camino elegirás? ¿La magia, la defensa o la estrategia?")}
El destino te espera...

`)
  );
}
// Funcion para esperar a que el jugador inicie luego del mensaje de bienvenida presionando una tecla
async function esperarTecla() {
  await inquirer.prompt([
    {
      type: "input",
      name: "continuar",
      message: chalk.gray("\nPresiona Enter para continuar..."),
    },
  ]);
}

// 🎮 Menú principal
async function main() {
  mostrarBienvenida(); // Mostrar el mensaje de bienvenida con arte
  await esperarTecla(); // función para esperar y continuar

  await initDB();

  let salir = false;

  while (!salir) {
    const { accion } = await inquirer.prompt([
      {
        type: "list",
        name: "accion",
        message: chalk.cyan.bold("¿Qué deseas hacer?"),
        choices: [
          { name: chalk.green("✨ Crear personaje"), value: "crear" },
          { name: chalk.yellow("🔥  Gestionar personaje"), value: "gestionar" },
          { name: chalk.red("❌ Salir"), value: "salir" },
        ],
      },
    ]);

    if (accion === "crear") {
      console.log(chalk.greenBright("\n🔨 Vamos a crear un nuevo personaje...\n"));
      await crearPersonaje();

    } else if (accion === "gestionar") {
      console.log(chalk.yellowBright("\n🔧 Vamos a gestionar tus personajes...\n"));
      await gestionarPersonaje();

    } else if (accion === "salir") {
      console.log(chalk.redBright("\n👋 ¡Hasta luego, aventurero!\n"));
      salir = true;
    }
  }

  process.exit();
}

// 🚀 Iniciar
main();
module.exports = main; // Exporta la función main para que pueda ser utilizada en otros módulos
