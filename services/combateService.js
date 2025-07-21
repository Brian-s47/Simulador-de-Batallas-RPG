// /services/combateService.js
const inquirer = require('inquirer');
const chalk = require('chalk');

// Función principal del sistema de combate
async function iniciarCombate(personaje, enemigo) {
  console.log(chalk.cyanBright(`\n🔰 ¡Comienza el combate entre ${personaje.nombre} y ${enemigo.nombre}!\n`));

  let turnoJugador = true;

  while (personaje.estaVivo() && enemigo.estaVivo()) {
    console.log(chalk.magenta(`\n❤️ ${personaje.nombre}: ${personaje.salud}/${personaje.saludMaxima} HP`));
    console.log(chalk.red(`💀 ${enemigo.nombre}: ${enemigo.salud}/${enemigo.saludMaxima} HP\n`));

    if (turnoJugador) {
      await turnoDelJugador(personaje, enemigo);
    } else {
      turnoDelEnemigo(personaje, enemigo);
    }

    // Reducir duración de efectos temporales
    if (typeof personaje.actualizarEfectosTemporales === 'function') personaje.actualizarEfectosTemporales();
    if (typeof enemigo.actualizarEfectosTemporales === 'function') enemigo.actualizarEfectosTemporales();

    await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa de 1 segundo
    turnoJugador = !turnoJugador;
  }

  if (personaje.estaVivo()) {
    console.log(chalk.greenBright(`\n🏆 ¡${personaje.nombre} ha derrotado a ${enemigo.nombre}!\n`));
    personaje.subirNivel();
  } else {
    console.log(chalk.redBright(`\n💀 ${personaje.nombre} ha sido derrotado por ${enemigo.nombre}...\n`));
  }
}

// Turno del jugador
async function turnoDelJugador(personaje, enemigo) {
  const habilidades = personaje.getHabilidades();

  const { accion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'accion',
      message: `¿Qué quieres hacer, ${personaje.nombre}?`,
      choices: habilidades.map(hab => hab.nombre)
    }
  ]);

  const habilidadSeleccionada = habilidades.find(hab => hab.nombre === accion);
  const resultado = habilidadSeleccionada.accion(enemigo);

  if (resultado) {
    console.log(chalk.blueBright(`🧠 ${resultado}`));
  }
}

// Turno del enemigo (IA)
function turnoDelEnemigo(personaje, enemigo) {
  if (enemigo.estaVivo()) {
    console.log(chalk.yellow(`\n🔥 ${enemigo.nombre} ataca a ${personaje.nombre}!\n`));
    enemigo.atacar(personaje);
  }
}

module.exports = {
  iniciarCombate
};
