const inquirer = require('inquirer');
const chalk = require('chalk');
const wrapAnsi = require('wrap-ansi'); // opcional, para envolver texto
const util = require('util');
const sleep = util.promisify(setTimeout);
const readline = require('readline');
const { eliminarPersonaje, guardarPersonaje } = require('../utils/personajeUtils');




function esperarTecla() {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('\n🕹️ Presiona Enter para continuar...', () => {
      rl.close();
      resolve();
    });
  });
}

// Función principal del sistema de combate
async function iniciarCombate(personaje, enemigo) {
  console.log(chalk.cyanBright(`\n🔰 ¡Comienza el combate entre ${personaje.nombre} y ${enemigo.nombre}!\n`));

  let turnoJugador = true;

  while (personaje.estaVivo() && enemigo.estaVivo()) {
  if (personaje.nivel === 6) {
    await mostrarFinalSecreto(personaje);
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
    console.clear();
    console.log(chalk.greenBright.bold(`\n🏆 ¡Victoria!\n`));
    console.log(chalk.yellow(`${personaje.nombre} ha vencido a ${enemigo.nombre} tras un duelo desafiante.`));
    await sleep(1500);

    console.log(chalk.cyanBright(`\n🧬 El poder fluye por sus venas...`));
    await sleep(1000);
    console.log(chalk.cyanBright(`🔺 Subiendo al nivel ${personaje.nivel + 1}...\n`));
    await sleep(1000);

    const recompensa = personaje.subirNivel(); // modificaremos este método para que retorne el objeto recibido
    await guardarPersonaje(personaje);

    if (recompensa && recompensa.nombre) {
      const info = [
        chalk.magenta.bold(`🎁 Objeto recibido: ${recompensa.nombre}`),
        chalk.gray(`📝 ${recompensa.descripcion}`),
        chalk.gray(`📦 Tipo: ${recompensa.tipo} ${recompensa.manos ? `(${recompensa.manos} manos)` : ''}`)
      ];

      if (Array.isArray(recompensa.modificadores)) {
        recompensa.modificadores.forEach(mod => {
          let modText = `➕ ${mod.tipo} ${mod.modo} ${mod.valor}`;
          if (mod.afecta) {
            modText += ` (aplica a ${mod.afecta.habilidad || 'todos'}, tipo: ${mod.afecta.tipoDanio || '-'})`;
          }
          info.push(chalk.gray(modText));
        });
      }

      console.log('\n' + info.join('\n'));
    }

    await esperarTecla();
  }else {
  console.clear();
  console.log(chalk.redBright.bold(`\n💀 ${personaje.nombre} ha sido derrotado por ${enemigo.nombre}...\n`));
  await new Promise(resolve => setTimeout(resolve, 1200));

  console.log(chalk.gray(`El eco de tu caída resuena en las cámaras de la torre...`));
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log(chalk.gray(`Tu historia se detiene aquí... pero no termina para siempre.`));
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log(chalk.yellowBright(`\n📜 Los héroes caen... pero las leyendas se reescriben.`));
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(chalk.whiteBright(`\n🌠 ${personaje.nombre}, tu sacrificio será recordado.\n`));

  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(chalk.red(`🗑️ Eliminando a ${personaje.nombre} de los registros del reino...\n`));

  await eliminarPersonaje(personaje.id);

  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(chalk.gray(`\n🕹️ Presiona Enter para regresar al menú principal...`));

  await esperarTecla(); // reutiliza la función de espera que definimos antes
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
