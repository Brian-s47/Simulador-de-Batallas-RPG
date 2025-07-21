// gestorDeBatallas.js
const inquirer = require('inquirer');
const chalk = require('chalk');
const { iniciarCombate } = require('./combateService.js');
const generarEnemigoPorNivel = require('../utils/generadorEnemigos.js');

async function iniciarAventura(personaje) {
    console.clear();
    console.log(chalk.greenBright(`🌟 ¡Bienvenido a la aventura, ${personaje.nombre} el ${personaje.tipo}!\n`));

    let continuar = true;

    while (personaje.estaVivo() && continuar) {
        console.log(chalk.cyan(`🧭 Tu nivel actual: ${personaje.nivel}`));

        // Generar enemigo del mismo nivel
        const enemigo = generarEnemigoPorNivel(personaje.nivel);
        console.log(chalk.redBright(`\n⚔️ Un ${enemigo.nombre} aparece en tu camino...\n`));

        // Iniciar batalla contra el enemigo
        await iniciarCombate(personaje, enemigo);

        if (!personaje.estaVivo()) {
        console.log(chalk.red('\n☠️ Tu aventura ha terminado...'));
        break;
        }

        // Preguntar si quiere seguir luchando o salir
        const { decision } = await inquirer.prompt([
        {
            type: 'list',
            name: 'decision',
            message: '¿Qué deseas hacer ahora?',
            choices: [
            'Continuar con la próxima batalla',
            'Salir del juego'
            ]
        }
        ]);

        if (decision === 'Salir del juego') {
        continuar = false;
        console.log(chalk.yellowBright(`\n🎉 ¡Gracias por jugar, ${personaje.nombre}! Nos vemos en tu próxima aventura.`));
        }
    }
}

module.exports = { iniciarAventura };
