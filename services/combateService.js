const inquirer = require('inquirer');
const chalk = require('chalk');
const { guardarPersonaje } = require('../utils/personajeUtils');

// Función principal del sistema de combate
async function iniciarCombate(personaje, enemigo) {
  console.log(chalk.cyanBright(`\n🔰 ¡Comienza el combate entre ${personaje.nombre} y ${enemigo.nombre}!\n`));

  let turnoJugador = true;

  while (personaje.estaVivo() && enemigo.estaVivo()) {
    if (personaje.nivel > 5) {
    console.log(chalk.yellowBright.bold(`\n👑 ¡${personaje.nombre} ha superado todos los niveles de la Torre!\n🎉 ¡Victoria total!`));
    continuar = false;
    return;
  }
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
    await guardarPersonaje(personaje);
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

  if (accion === 'Usar objeto') {
    const { tipoUso } = await inquirer.prompt([
      {
        type: 'list',
        name: 'tipoUso',
        message: '¿Qué deseas hacer?',
        choices: ['Consumir poción', 'Cambiar objeto equipado', 'Cancelar']
      }
    ]);

    if (tipoUso === 'Consumir poción') {
      const pociones = personaje.inventario.listarObjetos().filter(obj => obj.tipo === 'pocion' && obj.disponible);

      if (pociones.length === 0) {
        console.log('⚠️ No tienes pociones disponibles.');
        return;
      }

      const { seleccionPocion } = await inquirer.prompt([
        {
          type: 'list',
          name: 'seleccionPocion',
          message: 'Elige una poción para consumir:',
          choices: pociones.map(p => p.nombre)
        }
      ]);

      personaje.usarObjeto(seleccionPocion);

    } else if (tipoUso === 'Cambiar objeto equipado') {
      const disponibles = personaje.inventario.listarObjetos().filter(obj => obj.tipo === 'equipo' && obj.disponible);

      if (disponibles.length === 0) {
        console.log('⚠️ No tienes equipos disponibles para cambiar.');
        return;
      }

      const { seleccionEquipo } = await inquirer.prompt([
        {
          type: 'list',
          name: 'seleccionEquipo',
          message: 'Selecciona el objeto que deseas equipar:',
          choices: disponibles.map(obj => obj.nombre)
        }
      ]);

      try {
        personaje.cambiarEquipo(seleccionEquipo);
        console.log(`🛡️ Has equipado "${seleccionEquipo}".`);
      } catch (err) {
        console.log(`❌ Error al equipar: ${err.message}`);
      }
    }

    return; // Fin del turno tras usar objeto
  }

  // Acción normal del personaje (habilidad ofensiva o defensiva)
  const habilidadSeleccionada = habilidades.find(hab => hab.nombre === accion);
  const resultado = habilidadSeleccionada.accion(enemigo);
  if (resultado) console.log('🧠 Acción ejecutada:\n' + resultado);
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
