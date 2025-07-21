const Personaje = require('./Personaje');

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
        let danioFinal = this.ataque;

        // Verifica si tiene efecto de ataque reducido (por ejemplo, bola de hielo del mago)
        const efecto = this.efectosTemporales.find(e => e.nombre === 'ataque_reducido');
        if (efecto) {
        danioFinal = Math.max(this.ataque - efecto.valor, 1); // nunca menos de 1
        this.consumirEfecto('ataque_reducido');
        console.log(`${this.nombre} tiene el ataque reducido en ${efecto.valor}.`);
        }

        const tipoDanio = this._determinarTipoDanio();
        console.log(`${this.nombre} ataca con daño ${tipoDanio} causando ${danioFinal} de daño.`);
        objetivo.recibirDanio(danioFinal, tipoDanio);
    }

    _determinarTipoDanio() {
        // Determina si el ataque es mágico o físico según el tipo de enemigo
        if (
        this.nombre.toLowerCase().includes('mago') ||
        this.nombre.toLowerCase().includes('chamán') ||
        this.defensaMagica > this.defensaFisica
        ) {
        return 'magico';
        }
        return 'fisico';
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
