const Personaje = require('./Personaje.js');
console.log('DEBUG >> Personaje:', typeof Personaje);

class Enemigo extends Personaje {
    constructor(data) {
        super(data.nombre, 'Enemigo', data.nivel);

        this.salud = data.salud;
        this.saludMaxima = data.salud;
        this.ataque = data.ataque;
        this.defensaFisica = data.defensaFisica;
        this.defensaMagica = data.defensaMagica;
    }

    atacar(objetivo) {
    // 1. Determinar tipo de daño al azar
    const tipoDanio = this._determinarTipoDanio();

    // 2. Generar daño aleatorio base entre 1 y su ataque máximo
    let danioBase = Math.floor(Math.random() * this.ataque) + 1;
    let danioFinal = danioBase;
    let log = [`🎯 Daño base aleatorio: ${danioBase}`];

    // 3. Verificar si tiene efecto de ataque reducido (por Bola de Hielo)
    const efecto = this.efectosTemporales.find(e => e.nombre === 'ataque_reducido');
    if (efecto) {
        danioFinal = Math.max(danioFinal - efecto.valor, 1);
        this.consumirEfecto('ataque_reducido');
        log.push(`❄️ Ataque reducido por efecto en ${efecto.valor}. Nuevo daño: ${danioFinal}`);
    }

    // 4. Determinar golpe crítico (40% de probabilidad)
    function obtenerProbabilidadCritico(nivel) {
    switch (nivel) {
        case 1: return 0.05;
        case 2: return 0.10;
        case 3: return 0.20;
        case 4: return 0.25;
        case 5: return 0.35;
        default: return 0.10;
    }
    }
    const probCritico = obtenerProbabilidadCritico(this.nivel);
    const esCritico = Math.random() < probCritico;

    if (esCritico) {
        danioFinal *= 2;
        log.push(`💥 ¡Golpe crítico! Daño duplicado: ${danioFinal}`);
    }

    // 5. Mostrar resumen y aplicar daño
    console.log(`${this.nombre} ataca con daño ${tipoDanio} causando ${danioFinal} de daño.`);
    log.forEach(l => console.log(l));
    objetivo.recibirDanio(danioFinal, tipoDanio);
    }



    _determinarTipoDanio() {
        return Math.random() < 0.5 ? 'fisico' : 'magico';
    }

    getHabilidades() {
        return [
        {
            nombre: 'Atacar',
            accion: (objetivo) => this.atacar(objetivo)
        }
        ];
    }
}

module.exports = Enemigo;
