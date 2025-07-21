const chalk = require('chalk');

async function narrarLento(texto, velocidad = 1000) {
  console.clear();
  const lineas = texto.split('\n');

  for (const linea of lineas) {
    console.log(chalk.gray(linea));
    await new Promise(resolve => setTimeout(resolve, velocidad));
  }
}
async function iniciarAventura(personaje) {
  if (personaje.nivel === 1) {
    const narrativa = 
`La Torre de los Tres Caminos es una construcción ancestral, erigida en el corazón del Reino de O’dromos.

Su creación fue ordenada por el monarca de estas tierras, con la ayuda de sus tres más fieles consejeros. La torre fue diseñada como un desafío letal, reservado únicamente para aquellos héroes dispuestos a convertirse en los verdaderos defensores del reino.

Sin embargo, no es un reto cualquiera... Entrar en la torre implica aceptar el riesgo de perderlo todo: tu vida, tu alma y tu legado.

Solo los valientes de corazón puro y voluntad férrea se atreven a cruzar sus puertas.

🌑 Asciende por sus niveles, enfréntate a criaturas olvidadas por el tiempo…  
y demuestra que tu destino está escrito en las alturas.

Pero recuerda...

☠️ Si fallas, tu historia terminará allí. Y no habrá regreso.`
    ;

    await narrarLento(narrativa, 1500); // Mostrar con pausa entre líneas
  }

  // Aquí puedes continuar con el flujo del juego, como la selección de batalla
}

module.exports = {
  iniciarAventura
};



