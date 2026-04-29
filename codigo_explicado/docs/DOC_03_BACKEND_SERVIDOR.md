# Módulo 03 — Backend: Servidor y Conexión a BD

Archivos: `backend/index.js` y `backend/bd.js`

---

## `backend/.env` — Variables de entorno

```
PORT=3007
DB_HOST=localhost
DB_USER=user_test
DB_PASSWORD=test
DB_NAME=gastro
```

Es un archivo de **configuración que NO se sube a git**.
Contiene datos sensibles (credenciales) y valores que cambian según el entorno
(desarrollo, producción).

El código lee estas variables con `process.env.NOMBRE_VARIABLE`.

---

## `backend/bd.js` — Pool de conexiones

```js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
```

### ¿Qué es un Pool de conexiones?

En lugar de abrir y cerrar una conexión a MySQL por cada consulta,
un **pool** mantiene un conjunto de conexiones abiertas y las reutiliza.

```
Sin pool:
  petición 1 → abrir conexión → consulta → cerrar conexión
  petición 2 → abrir conexión → consulta → cerrar conexión
  (lento, costoso)

Con pool:
  pool crea 5 conexiones al inicio
  petición 1 → toma conexión #1 → consulta → devuelve al pool
  petición 2 → toma conexión #2 (o #1 si ya está libre) → ...
  (rápido, eficiente)
```

### Verificación de conexión al arrancar

```js
pool.getConnection()
    .then((connection) => {
        console.log("✅ Conexión a la base de datos establecida exitosamente.");
        connection.release(); // devuelve la conexión al pool
    })
    .catch((err) => {
        console.error("❌ Error al conectar a la base de datos:", err.message);
    });
```

Al iniciar el servidor, intenta obtener una conexión del pool.
Si falla (credenciales incorrectas, MySQL apagado), muestra el error en consola.
**`connection.release()`** — crucial: devuelve la conexión al pool para que
otros puedan usarla. Sin esto, el pool se agotaría.

### `export default pool`

Exporta el pool para que todos los archivos de rutas puedan importarlo
e ir contra la misma base de datos.

```js
// En cualquier archivo de rutas:
import pool from "../bd.js";
const [rows] = await pool.query("SELECT * FROM ...");
```

---

## `backend/index.js` — Punto de entrada del servidor

```js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import pool from "./bd.js";

import categoriasRoutes from "./routes/categorias.js";
import detallesRoutes from "./routes/detalle_pedidos.js";
import pedidosRoutes from "./routes/pedidos.js";
import productosRoutes from "./routes/productos.js";
import usuariosRoutes from "./routes/usuarios.js";
```

Importa las librerías y todos los archivos de rutas.

### Crear y configurar la app

```js
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
```

| Línea                     | Qué hace                                                             |
| ------------------------- | -------------------------------------------------------------------- |
| `express()`               | Crea la aplicación Express                                           |
| `dotenv.config()`         | Carga el archivo `.env` en `process.env`                             |
| `app.use(cors())`         | Permite requests desde cualquier origen (necesario para el frontend) |
| `app.use(express.json())` | Permite recibir JSON en el body de POST/PUT                          |

### ¿Qué es CORS?

**Cross-Origin Resource Sharing** — política del navegador que bloquea
peticiones entre dominios distintos por seguridad.

```
Frontend en:  http://localhost:5500   (Live Server)
Backend en:   http://localhost:3007

Sin cors() → el navegador bloquea la petición (aunque el backend responda)
Con cors()  → el backend dice "acepto peticiones de cualquier origen"
```

### Puerto y rutas

```js
const port = process.env.PORT || 3000;
```

Usa el puerto del `.env` (3007). Si no existe esa variable, usa 3000 como fallback.

```js
app.get("/", (req, res) => {
    res.send("Hola!");
});

app.use("/", usuariosRoutes);
app.use("/", pedidosRoutes);
app.use("/", categoriasRoutes);
app.use("/", detallesRoutes);
app.use("/", productosRoutes);
```

`app.use("/", rutasX)` — monta todas las rutas de ese archivo bajo la ruta base `/`.
Las rutas dentro del archivo (ej: `/usuarios`) se concatenan con la base.

### Endpoint de prueba

```js
app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1 as test");
        res.json({
            success: true,
            message: "Conexión a la base de datos exitosa",
            data: rows,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al conectar",
            error: error.message,
        });
    }
});
```

Visitar `http://localhost:3007/test-db` en el navegador permite verificar
que el servidor puede hablar con MySQL sin necesidad de herramientas externas.

`SELECT 1 as test` — consulta mínima que no toca ninguna tabla real,
solo verifica que la conexión funciona.

### Iniciar el servidor

```js
app.listen(port, () => {
    console.log(`Server on: http://localhost:${port}`);
});
```

`app.listen()` — arranca el servidor y queda escuchando en el puerto indicado.
El callback (función flecha) se ejecuta una vez que el servidor está listo.

---

## Flujo completo al arrancar

```
npm run dev
    │
    ├─ nodemon ejecuta: node backend/index.js
    │
    ├─ index.js importa bd.js
    │       └─ bd.js crea el pool
    │       └─ bd.js prueba una conexión → "✅ Conexión establecida"
    │
    ├─ index.js configura middlewares (cors, json)
    │
    ├─ index.js registra las 5 rutas
    │
    └─ app.listen(3007) → "Server on: http://localhost:3007"
```

---

## Concepto: async/await

Todas las consultas a la base de datos son **asíncronas**: no bloquean
el servidor mientras esperan respuesta de MySQL.

```js
// Sin async/await (callback hell — difícil de leer)
pool.query("SELECT * FROM usuarios", function(err, rows) {
    if (err) { ... }
    pool.query("SELECT * FROM pedidos", function(err2, rows2) { ... })
})

// Con async/await (legible, secuencial)
const [rows]  = await pool.query("SELECT * FROM usuarios");
const [rows2] = await pool.query("SELECT * FROM pedidos");
```

**`await`** — pausa la función hasta que la promesa resuelve.
Solo se puede usar dentro de una función marcada con **`async`**.

## Concepto: destructuring en la query

```js
const [rows] = await pool.query("SELECT * FROM usuarios");
//     ^^^^^
// mysql2 devuelve [filas, camposMetadata]
// Solo nos interesa el primer elemento: las filas
```

`mysql2` devuelve un array de dos elementos. Con `[rows]` tomamos
solo el primero (las filas) e ignoramos el segundo (metadata de columnas).
