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
    const narrativa = chalk.yellowBright(`
${chalk.bold("🏰 La Torre de los Tres Caminos")} es una construcción ancestral, erigida en el corazón del Reino de ${chalk.italic("O’dromos")}.

Su creación fue ordenada por el monarca de estas tierras, con la ayuda de sus tres más fieles consejeros. La torre fue diseñada como un desafío letal, reservado únicamente para aquellos héroes dispuestos a convertirse en los verdaderos defensores del reino.

${chalk.cyan("⚠️ Sin embargo, no es un reto cualquiera...")} Entrar en la torre implica aceptar el riesgo de perderlo todo: tu vida, tu alma y tu legado.

${chalk.bold("Solo los valientes")} de corazón puro y voluntad férrea se atreven a cruzar sus puertas.

${chalk.gray("🌑 Asciende por sus niveles, enfréntate a criaturas olvidadas por el tiempo…")}  
y demuestra que tu destino está escrito en las alturas.

${chalk.redBright("☠️ Si fallas, tu historia terminará allí. Y no habrá regreso.")}`);

    await narrarLento(narrativa, 1500);
  } else if (personaje.nivel === 2) {
    const narrativa = chalk.magentaBright(`
${chalk.bold("⚔️ Has sobrevivido...")} al primer umbral de la Torre de los Tres Caminos.

Pero los ecos del acero aún resuenan tras de ti, y lo que te aguarda no es más amable.  
Aquí, los enemigos ya no son simples bestias. Son ${chalk.italic("guardianes de secretos")}, nacidos del odio, la desesperación y la magia corrupta.

${chalk.yellow("🔥 Las paredes vibran con una energía antigua...")}  
Una fuerza que prueba no solo tu espada, sino tu espíritu.

Cada paso que des ahora se escribe con sangre y ceniza.  
Cada batalla te acercará a la cima… o a tu final.

${chalk.cyanBright("🌀 Segundo nivel desbloqueado.")}  
Que tu voluntad sea firme, y tus decisiones letales.

${chalk.red("🩸 No hay marcha atrás.")}`);

    await narrarLento(narrativa, 1500);
  } else if (personaje.nivel === 3) {
    const narrativa = chalk.redBright(`
${chalk.bold("🕯️ Tercer nivel alcanzado...")} El aire es más denso, y la oscuridad se vuelve tangible.

Aquí abajo, el tiempo se desvanece. Las criaturas que acechan no obedecen lógica ni razón.  
Son sombras con dientes. Pesadillas hechas carne.

${chalk.magenta("⚙️ Ruidos metálicos y susurros arcanos llenan los pasillos.")}  
Nada en esta parte de la torre es natural. Todo vibra con magia prohibida.

La voluntad empieza a quebrarse.  
Pero solo quienes han llegado hasta aquí saben que ya no se trata solo de fuerza...

${chalk.bold("🧠 La mente también es un campo de batalla.")}

${chalk.yellowBright("🕳️ Bienvenido al corazón del abismo.")}`);
    await narrarLento(narrativa, 1500);
  } else if (personaje.nivel === 4) {
    const narrativa = chalk.blueBright(`
${chalk.bold("🌀 La energía de la torre cambia...")} te observa, te estudia.

Solo unos pocos elegidos han llegado a este punto, y ninguno lo ha contado.

${chalk.gray("Tus heridas ya no son solo físicas.")}  
La torre ha empezado a entrar en ti. Te hace dudar, te quiere quebrar desde dentro.

El camino no se alumbra más con antorchas...  
Ahora son ${chalk.italic("tus decisiones")} las que iluminan o condenan.

${chalk.cyanBright("⚖️ Este es el Juicio.")}  
Tu poder, tu compasión, tu ego… todo será puesto a prueba.

${chalk.red("Y no todos los héroes merecen el final que desean.")}`);
    await narrarLento(narrativa, 1500);
  } else if (personaje.nivel === 5) {
    const narrativa = chalk.yellow.bold(`
${chalk.bold("👑 Has llegado a la cima...")}

Más allá de esta última puerta, el destino del Reino de O’dromos será decidido.

Ya no quedan aliados. No hay atajos. No hay redención.

${chalk.italic("El guardián final espera.")}  
Una entidad forjada en eras pasadas, alimentada con las almas de los que cayeron.

${chalk.magentaBright("💫 La torre está viva, y tú eres su última amenaza... o su mayor error.")}

Cada elección te ha traído hasta aquí.

Cada golpe, cada pérdida, cada respiro…

${chalk.greenBright("⚔️ Este es tu momento.")}

${chalk.redBright("No hay mañana. Solo victoria... o silencio eterno.")}`);
    await narrarLento(narrativa, 1500);
  }



}

module.exports = {
  iniciarAventura
};



