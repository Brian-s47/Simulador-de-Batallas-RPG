# Simulador de Batallas RPG

## 🌟 Descripción General

Este proyecto es un simulador de batallas estilo RPG por turnos, enfocado en la creación, personalización y evolución de personajes. Los jugadores pueden elegir entre distintas clases (Guerrero, Arquero o Mago), equiparlos con objetos, mejorar sus habilidades y enfrentarse a enemigos o entre ellos.

### 🧙‍♂️ Dinámica

* Crear personajes con inventario inicial y defensa personalizada.
* Gestionar el inventario: equipar objetos, usar pociones, reemplazar equipo.
* Participar en batallas donde las estadísticas y objetos influyen en el daño y la defensa.
* Aplicar efectos temporales y recibir recompensas luego de las batallas.

---

## 📂 Estructura del Proyecto

```
SIMULADOR-DE-BATALLAS-RPG
├── data/
│   ├── enemigos.json
│   ├── objetos.json
│   └── personajes.json
├── src/
│   ├── ClaseInventario/
│   │   ├── Arma.js
│   │   ├── Armadura.js
│   │   ├── Inventario.js
│   │   ├── Objeto.js
│   │   └── Pocion.js
│   └── ClasePersonajes/
│       ├── Arquero.js
│       ├── Guerrero.js
│       ├── Mago.js
│       └── Personaje.js
├── utils/
│   ├── consola.js
│   ├── generadorID.js
│   └── personajeUtils.js
├── index.js
├── package.json
├── README.md
└── test.js
```

---

## 🎨 Lógica del Juego

### 👨‍💻 Clases y Herencias

* `Personaje` (clase base): contiene atributos comunes como salud, ataque, defensa, nivel, etc.
* `Guerrero`, `Arquero`, `Mago`: heredan de `Personaje` y tienen habilidades especiales.

### 📚 Inventario y Objetos

* Clase `Inventario`: almacena objetos y controla qué está equipado.
* Clase `Objeto`: representa armas, armaduras o pociones.
* Equipamiento limitado por manos (2), se valida en `cambiarEquipo()`.
* Efectos modificadores de objetos pueden:

  * Aumentar daño (`tipo: 'daño'`)
  * Incrementar defensa (`tipo: 'defensa'`)
  * Curar (`tipo: 'curacion'`)
  * Absorber daño (`tipo: 'absorcion'`)

### ✨ Habilidades

Cada clase tiene habilidades específicas:

#### Guerrero

* Ataque básico (físico)
* Furia (mayor daño)

#### Arquero

* Flecha perforante (daño físico)
* Flecha arcana (daño mágico)

#### Mago

* Bola de fuego / hielo (daño mágico)
* Reflejo (absorción de daño)

### 📊 Estados Temporales

* Efectos aplicados por pociones u objetos (curación, refuerzo, debuffs).
* Se almacenan en el array `efectosTemporales`.

### 💰 Recompensas y Progresión

* Tras cada batalla:

  * se puede subir de nivel,
  * recibir objetos nuevos,
  * aplicar efectos de mejora.

---

---

## Diagrama UML

![alt text](<Diagrama UML.png>)

```

## ⚖️ Librerías Usadas y Versiones

Asegurate de instalar estas librerías:

```bash
npm install inquirer@9.1.5 lowdb@6.0.1 uuid@9.0.0 chalk@5.3.0
```

* `inquirer`: para menús interactivos por consola.
* `lowdb`: base de datos JSON simple y rápida.
* `uuid`: generador de IDs únicos para los personajes.
* `chalk`: para colorear mensajes en consola (a implementar en consola.js).

---

## 🏙️ Diagrama de Entidades (actualizado)

```
+---------------+
|   Personaje   |
+---------------+
| id            |
| nombre        |
| tipo          |
| salud         |
| ataque        |
| defensaFisica |
| defensaMagica |
| inventario    |
| nivel         |
+---------------+
       |
       | hereda
       v
+-------------+   +-------------+   +-------------+
|  Guerrero   |   |   Arquero   |   |    Mago     |
+-------------+   +-------------+   +-------------+
| habilidad   |   | habilidad   |   | habilidad   |
+-------------+   +-------------+   +-------------+

+--------------+
|  Inventario  |
+--------------+
| objetos[]    |
| equipados[]  |
+--------------+
       |
       v
+------------+
|  Objeto     |
+------------+
| nombre      |
| tipo        |
| manos       |
| modificadores[] |
| tiposPermitidos |
+------------+
```

---

## 🛠️ Comandos de Uso

### Ejecutar la app

```bash
node index.js
```

### Crear personaje

Menú interactivo:

* Elegís nombre, clase, defensa secundaria (si aplica) y objetos iniciales.

### Ver personajes

Muestra lista de personajes guardados.

---

## 🔧 Próximos pasos

* Implementar motor de batallas (daño, turnos, IA, etc.).
* Diseñar interfaz de usuario.
* Incorporar sistema de recompensas.
* Guardar historial de batallas.

---

## 📁 Integrantes

Brian Fair Suarez Porras
Jhon Isaac Medina Florez
Joan Sebastian Omaña Suarez

---

☑ï Archivo listo para entrega y uso colaborativo ✔️
