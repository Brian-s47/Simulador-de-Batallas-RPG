const Guerrero = require('./src/ClasePersonajes/Guerrero');
const { iniciarCombate } = require('./services/combateService');

// Enemigo simulado tipo Guerrero
const enemigo = new Guerrero("Orco Bruto", 1);
enemigo.salud = 80; // Ajusta para la prueba

// Personaje jugador
const jugador = new Guerrero("Thorgal", 1);

// Iniciar combate
iniciarCombate(jugador, enemigo);