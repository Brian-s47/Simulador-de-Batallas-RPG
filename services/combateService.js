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

    await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa de 1 segundo entre turnos
    turnoJugador = !turnoJugador; // Alternar turnos
  }

  // Resultado final
  if (personaje.estaVivo()) {
    console.log(chalk.greenBright(`\n🏆 ¡${personaje.nombre} ha derrotado a ${enemigo.nombre}!\n`));
    personaje.subirNivel(); // Sube de nivel al ganar
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
  habilidadSeleccionada.accion(enemigo); // Ejecutar acción sobre el enemigo
}

// Turno de la "IA" enemiga (básico: ataque básico siempre)
function turnoDelEnemigo(personaje, enemigo) {
  if (enemigo.estaVivo()) {
    console.log(chalk.yellow(`\n🔥 ${enemigo.nombre} ataca a ${personaje.nombre}!\n`));
    enemigo.atacar(personaje); // Usa el método atacar del enemigo
  }
}

module.exports = {
  iniciarCombate
};
