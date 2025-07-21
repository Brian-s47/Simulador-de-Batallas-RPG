const inquirer = require('inquirer');
const chalk = require('chalk');
const boxen = require('boxen');
const {
  cargarPersonajes,
  guardarPersonaje,
  eliminarPersonaje,
  deserializarPersonaje,
} = require('./personajeUtils');
const { iniciarAventura } = require('./narrador');

async function gestionarPersonaje() {
  console.clear(); // 🧹 Limpiar consola

  const personajes = await cargarPersonajes();

  if (personajes.length === 0) {
    console.log(
      boxen(chalk.redBright.bold('❌ No hay personajes para gestionar.'), {
        padding: 1,
        margin: 1,
        borderColor: 'red',
        borderStyle: 'double',
      })
    );
    return;
  }

  // Encabezado
  console.log(
    boxen(chalk.cyan.bold('📜 Selección de Personaje'), {
      padding: 1,
      margin: 1,
      borderColor: 'cyan',
      borderStyle: 'round',
    })
  );

  // Lista de personajes estilizados con chalk (sin boxen)
  const personajesFormateados = personajes.map((p) => {
    const nombre = `${p.nombre}`;
    const tipoNivel = `(${p.tipo}, Nivel ${p.nivel})`;
    const linea = `${chalk.bold(nombre)} ${chalk.gray(tipoNivel)}`;
    return {
      name: linea,
      value: p,
    };
  });

  const { seleccionado } = await inquirer.prompt({
    type: 'list',
    name: 'seleccionado',
    message: chalk.cyanBright('Selecciona un personaje:'),
    choices: personajesFormateados,
  });

  console.clear(); // Limpiar después de seleccionar personaje

  const personaje = deserializarPersonaje(seleccionado);

  const opciones = [
    personaje.nivel === 1 ? '⚔️ Iniciar batalla' : '🛡️ Continuar batalla',
    '📖 Ver detalles',
    '✏️ Cambiar nombre',
    '🗑️ Eliminar personaje',
    '🔙 Volver',
  ];

  console.log(
    boxen(
      chalk.yellowBright.bold(
        `¿Qué deseas hacer con ${chalk.underline(personaje.nombre)}?`
      ),
      {
        padding: 1,
        margin: 1,
        borderColor: 'yellow',
        borderStyle: 'classic',
      }
    )
  );

  const { accion } = await inquirer.prompt({
    type: 'list',
    name: 'accion',
    message: '',
    choices: opciones,
  });

  console.clear(); // Limpiar antes de acción

  if (
    accion === '⚔️ Iniciar batalla' ||
    accion === '🛡️ Continuar batalla'
  ) {
    await iniciarAventura(personaje);

    console.log(
      boxen(chalk.greenBright('🎯 ¡Batalla iniciada con éxito!'), {
        padding: 1,
        margin: 1,
        borderColor: 'green',
        borderStyle: 'round',
      })
    );
  } else if (accion === '📖 Ver detalles') {
  const inventarioTexto = (personaje.inventario && personaje.inventario.length > 0)
    ? personaje.inventario
        .map(obj => {
          const estado = obj.disponible ? chalk.green('🟢 Disponible') : chalk.red('🔴 No disponible');
          return `  - ${chalk.bold(obj.nombre)} (${chalk.gray(obj.tipo)}, ${chalk.yellow(`manos: ${obj.manos}`)}) ${estado}`;
        })
        .join('\n')
    : chalk.gray('  (vacío)');

  const detalles = `
${chalk.bold('📋 Detalles de')} ${chalk.yellowBright(personaje.nombre)}

${chalk.cyan('🧝 Clase:')} ${chalk.white(personaje.tipo)}
${chalk.cyan('⭐ Nivel:')} ${chalk.white(personaje.nivel)}
${chalk.cyan('❤️ Salud:')} ${chalk.white(personaje.salud)}
${chalk.cyan('💥 Ataque:')} ${chalk.white(personaje.ataque ?? 'N/A')}
${chalk.cyan('🛡️ Defensa física:')} ${chalk.white(personaje.defensaFisica ?? 'N/A')}
${chalk.cyan('🪄 Defensa mágica:')} ${chalk.white(personaje.defensaMagica ?? 'N/A')}
`;

  console.log(
    boxen(detalles, {
      padding: 1,
      margin: 1,
      borderColor: 'blue',
      borderStyle: 'round',
    })
  );

  await inquirer.prompt([
    {
      type: 'input',
      name: 'continuar',
      message: chalk.gray('\nPresiona Enter para volver al menú...'),
    },
  ]);

  } else if (accion === '✏️ Cambiar nombre') {
    const { nuevoNombre } = await inquirer.prompt({
      type: 'input',
      name: 'nuevoNombre',
      message: chalk.magenta('Ingresa el nuevo nombre:'),
    });

    personaje.nombre = nuevoNombre;
    await guardarPersonaje(personaje);

    console.log(
      boxen(chalk.green('✅ Nombre actualizado correctamente.'), {
        padding: 1,
        margin: 1,
        borderColor: 'green',
        borderStyle: 'single',
      })
    );
  } else if (accion === '🗑️ Eliminar personaje') {
    const { confirmacion } = await inquirer.prompt({
      type: 'confirm',
      name: 'confirmacion',
      message: chalk.redBright(
        `¿Estás seguro de eliminar a ${personaje.nombre}?`
      ),
    });

    if (confirmacion) {
      await eliminarPersonaje(personaje.id);

      console.log(
        boxen(chalk.redBright.bold('🗑️ Personaje eliminado.'), {
          padding: 1,
          margin: 1,
          borderColor: 'red',
          borderStyle: 'double',
        })
      );
    } else {
      console.log(
        chalk.gray('🚫 Cancelado. El personaje no fue eliminado.\n')
      );
    }
  }

  // Volver o seguir
  if (accion !== '🔙 Volver') {
    await gestionarPersonaje(); // Volver al menú de gestión
  }
}

module.exports = gestionarPersonaje;
