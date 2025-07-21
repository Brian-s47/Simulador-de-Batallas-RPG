const inquirer = require('inquirer');
const chalk = require('chalk');
const { cargarPersonajes, guardarPersonaje, eliminarPersonaje, deserializarPersonaje } = require('./personajeUtils');
const { iniciarAventura } = require('./narrador');

async function gestionarPersonaje() {
  const personajes = await cargarPersonajes();
  if (personajes.length === 0) {
    console.log(chalk.red("❌ No hay personajes para gestionar."));
    return;
  }

  const { seleccionado } = await inquirer.prompt({
    type: "list",
    name: "seleccionado",
    message: "Selecciona un personaje:",
    choices: personajes.map(p => `${p.nombre} (${p.tipo}, Nivel ${p.nivel})`)
  });

  const personajePlano = personajes.find(p => seleccionado.includes(p.nombre) && seleccionado.includes(`Nivel ${p.nivel}`));
  const personaje = deserializarPersonaje(personajePlano);

  const opciones = [
  personaje.nivel === 1 ? "Iniciar batalla" : "Continuar batalla",
  "Ver detalles",
  "Cambiar nombre",
  "Eliminar personaje",
  "Volver"
];

const { accion } = await inquirer.prompt({
  type: "list",
  name: "accion",
  message: `¿Qué deseas hacer con ${personaje.nombre}?`,
  choices: opciones
});

  if (accion === "Iniciar batalla" || accion === "Continuar batalla") {
  await iniciarAventura(personaje);
} else if (accion === "Ver detalles") {
    console.log(chalk.blueBright(`\n📜 Detalles de ${personaje.nombre}:\n`));
    console.dir(personaje, { depth: null, colors: true });
  } else if (accion === "Cambiar nombre") {
    const { nuevoNombre } = await inquirer.prompt({
      type: "input",
      name: "nuevoNombre",
      message: "Ingresa el nuevo nombre:"
    });
    personaje.nombre = nuevoNombre;
    await guardarPersonaje(personaje);
    console.log(chalk.green("✅ Nombre actualizado."));
  } else if (accion === "Eliminar personaje") {
    const { confirmacion } = await inquirer.prompt({
      type: "confirm",
      name: "confirmacion",
      message: `¿Estás seguro de eliminar a ${personaje.nombre}?`
    });

    if (confirmacion) {
      await eliminarPersonaje(personaje.id);
      console.log(chalk.redBright("🗑️ Personaje eliminado."));
    }
  }

  // Permite seguir gestionando si no se elige "Volver"
  if (accion !== "Volver") {
    return gestionarPersonaje();
  } 
}

module.exports = gestionarPersonaje;
