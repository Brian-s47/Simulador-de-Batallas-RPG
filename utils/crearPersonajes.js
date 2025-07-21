const inquirer = require('inquirer');
const chalk = require('chalk');
const readline = require('readline');
const Guerrero = require('../src/ClasePersonajes/Guerrero');
const Arquero = require('../src/ClasePersonajes/Arquero');
const Mago = require('../src/ClasePersonajes/Mago');
const Objeto = require('../src/ClaseInventario/Objeto');
const objetosDisponibles = require('../data/objetos.json');
const { guardarPersonaje } = require('./personajeUtils');
const main = require('../index'); // Importa la función main desde index.js

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
         (  \\\___/  )
         |  (_)  (_)\\
         \\    _|    |
         /\\__/   \\\__/\\
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
  /_/   |_|   \\
   MAGO MÍSTICO  
    `));
        personaje = new Mago(nombre);
    }

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

    objetosSeleccionados.forEach(obj => {
        personaje.inventario.agregarObjeto(obj);
        if (obj.tipo === 'equipo') {
            personaje.inventario.cambiarEquipo(obj.nombre);
        }
    });
    console.log(chalk.yellowBright.bold(`\n✅ ¡El personaje de clase ${chalk.magenta(tipo)} llamado ${chalk.cyan(nombre)} ha sido creado exitosamente!\n`));

    await guardarPersonaje(personaje);

    // Esperar tecla y redirigir
    await esperarTecla();
    return
}

module.exports = crearPersonaje;

function esperarTecla() {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(chalk.gray('\nPresiona cualquier tecla para regresar al menú principal...'), () => {
            rl.close();
            resolve();
        });
    });
}