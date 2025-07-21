
const enemigosData = require('../data/enemigos.json');
const Enemigo = require('../src/ClasePersonajes/Enemigo');

/**
 * Genera un enemigo aleatorio del mismo nivel que el personaje
 * @param {number} nivel - Nivel del personaje
 * @returns {Enemigo}
 */
function generarEnemigoPorNivel(nivel) {
    const posibles = enemigosData.filter(e => e.nivel === nivel);

    if (posibles.length === 0) {
        throw new Error(`No hay enemigos disponibles para el nivel ${nivel}`);
    }

    const elegido = posibles[Math.floor(Math.random() * posibles.length)];
    return new Enemigo(elegido);
}

module.exports = generarEnemigoPorNivel;
