# 🧙‍♂️ Simulador de Batallas RPG (CLI - Node.js)

Un juego de rol por turnos basado en consola donde el jugador crea y gestiona héroes que ascienden por la temida **Torre de los Tres Caminos**. Usa estrategia, equipo y habilidades únicas para sobrevivir a enemigos cada vez más peligrosos. ¡Una experiencia envolvente con estilo visual interactivo, efectos temporales y progresión por niveles!

---

## 🎮 Características Principales

- ✅ Creación de personajes con clases únicas: **Guerrero**, **Mago**, **Arquero**.
- 🧩 Sistema de inventario dinámico: armas, pociones y objetos especiales.
- ⚔️ Combate por turnos con habilidades y decisiones tácticas.
- 🧠 IA básica de enemigos.
- 🏆 Subida de nivel y progresión tras cada batalla.
- 🌈 Interfaz visual en consola con `chalk` y `boxen` para una experiencia estilizada.
- 💾 Guardado persistente con `lowdb` en formato JSON.
- 🔁 Repetición de combates, gestión de personajes y personalización posterior.

---

## 🏗️ Estructura del Proyecto

```
SIMULADOR-DE-BATALLAS-RPG
├── index.js                         # Punto de entrada principal
├── data/                           # Datos persistentes del juego
│   ├── personajes.json             # Personajes creados
│   ├── enemigos.json               # Plantillas de enemigos
│   └── objetos.json                # Objetos disponibles
├── services/                           # Datos persistentes del juego
│   ├── GestorBatalla.js                # Ciclo de batallas con decisión                 
│   ├── combateService.js               # Motor de combate (turnos y lógica)
├── src/
│   ├── ClasePersonajes/           # Sistema de herencia de clases
│   │   ├── Personaje.js
│   │   ├── Guerrero.js
│   │   ├── Arquero.js
│   │   ├── Enemigo.js
│   │   └── Mago.js
│   └── ClaseInventario/           # Modelo de inventario y objetos
│       ├── Inventario.js
│       ├── Objeto.js
├── utils/
│   ├── crearPersonajes.js          # Menú de creación
│   ├── gestionarPersonajes.js      # Menú de gestión y acciones
│   ├── generadorEnemigos.js        # Generación aleatoria de enemigos
│   ├── narrador.js                 # Narrativa e introducción por nivel
│   ├── personajeUtils.js           # Guardado, carga y serialización
├── .gitignore
├── Diagrama UML.png
├── package.json
├── package-lock.json
└── README.md       
```

---

## 🧠 Mecánicas del Juego

### 👤 Clases Jugables

| Clase     | Descripción                                                                 |
|-----------|-----------------------------------------------------------------------------|
| 🛡️ Guerrero | Especialista en defensa física, usa armas pesadas y escudos.              |
| 🏹 Arquero   | Balance entre ataque físico y mágico, con habilidades a distancia.        |
| 🔮 Mago      | Poder ofensivo mágico con control de elementos (fuego, hielo, reflejo).   |

Cada clase tiene acceso a habilidades únicas según su rol.

---

### 🧰 Sistema de Inventario

- Maneja un inventario limitado por manos.
- Equipamiento activo afecta estadísticas del personaje.
- Uso de **pociones** y **cambio de objetos** en combate.
- Objetos tienen modificadores como:
  - `curacion`, `daño`, `defensa`, `absorcion`.

---

### 🧙 Combate y Habilidades

- Sistema **por turnos** con IA de enemigos.
- Habilidades definidas en cada clase (`getHabilidades()`).
- Menú interactivo para usar habilidades o gestionar el inventario.
- Al finalizar combate:
  - El personaje sube de nivel.
  - Puede obtener mejoras o nuevos objetos (por implementar).
  - Si muere, su progreso se pierde.

---

### 📦 Guardado y Base de Datos

- El juego guarda automáticamente los personajes en `personajes.json`.
- Al cargar un personaje, su clase e inventario se **deserializan correctamente** con lógica personalizada.
- Los objetos en inventario se restauran a instancias funcionales gracias a la clase `Inventario.js`.

---

## 📜 Estética y Experiencia en Consola

Gracias a `chalk` y `boxen`, el juego ofrece:

- Colores según contexto (verde: éxito, rojo: peligro, azul: info, etc).
- Marcos decorativos con bordes, padding y estilos únicos.
- Uso de íconos Unicode para mejorar la ambientación (💀🧙‍♂️🎒🗡️).

---

## 📥 Instalación

```bash
git clone https://github.com/Brian-s47/Simulador-de-Batallas-RPG.git
cd Simulador-de-Batallas-RPG
npm install
```

---

## 🚀 Ejecutar el Juego

```bash
node index.js
```

---

## 🛠️ Dependencias

```json
{
  "chalk": "^4.1.2",
  "inquirer": "^8.2.6",
  "lowdb": "^3.0.0",
  "uuid": "^9.0.1",
  "boxen": "^5.1.2"
}
```

---

## 🧪 Próximos Pasos

- 💬 Sistema de diálogos entre personajes o con NPCs.
- 💾 Historial de batallas y log de decisiones.
- 🎁 Sistema de recompensas aleatorias tras cada batalla.
- 🧠 IA más compleja (habilidades defensivas o debuffs).
- 🌍 Implementar mapa o rutas (ramificaciones narrativas).
- 🌐 Integración visual con GUI o migración a versión web.

---

## 📹 Video demostrativo

Aquí puedes ver una demostración en video del funcionamiento del proyecto:
🔗 [Ver video en YouTube](https://www.youtube.com/watch?v=gLsz0NRCwwM)  


## 🧑‍🤝‍🧑 Créditos

> Desarrollado por:

- **Brian Fair Suarez Porras**
- **Jhon Isaac Medina Mendoza**
- **Joan Sebastian Omaña Suarez**

Gracias por probar nuestro juego. ¡Tu próxima batalla te espera!
