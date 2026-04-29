# Módulo 04 — Backend: Rutas (API REST)

Archivos: `backend/routes/*.js`

---

## Estructura común de todos los archivos de rutas

Todos los 5 archivos siguen exactamente el mismo patrón:

```js
import { Router } from "express";
import pool from "../bd.js";

const router = Router();

// ... definición de endpoints ...

export default router;
```

**`Router()`** — crea un mini-router de Express. Es como una app Express
pero más pequeña, pensada para agrupar rutas relacionadas.
Luego se monta en la app principal con `app.use()`.

---

## Anatomía de un endpoint

Vamos a diseccionar una ruta completa:

```js
router.get("/usuarios/:id", async (req, res) => {
    const { id } = req.params; // 1. Leer parámetro de la URL
    try {
        const [rows] = await pool.query(
            "SELECT * FROM usuarios WHERE id = ?", // 2. Query preparada
            [id], // 3. Parámetros seguros
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" }); // 4. 404
        }
        res.json(rows[0]); // 5. Respuesta exitosa
    } catch (error) {
        res.status(500).json({ error: error.message }); // 6. Error del servidor
    }
});
```

| Parte                | Explicación                                         |
| -------------------- | --------------------------------------------------- |
| `router.get(...)`    | Solo responde a peticiones HTTP GET                 |
| `"/usuarios/:id"`    | `:id` es un parámetro dinámico en la URL            |
| `req.params`         | Objeto con los parámetros de la URL (`{ id: "5" }`) |
| `"... WHERE id = ?"` | El `?` es un placeholder (no concatenar strings)    |
| `[id]`               | Array con los valores para reemplazar los `?`       |
| `rows.length === 0`  | Si no encontró resultados → 404 Not Found           |
| `res.status(404)`    | Envía código HTTP 404                               |
| `res.json(...)`      | Envía respuesta JSON con código 200 por defecto     |
| `catch (error)`      | Si la query falla → 500 Internal Server Error       |

### ¿Por qué usar `?` en lugar de concatenar?

```js
// PELIGROSO — SQL Injection
const query = "SELECT * FROM usuarios WHERE id = " + id;
// Si id = "1 OR 1=1", devuelve todos los usuarios

// SEGURO — Query parametrizada
pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
// mysql2 escapa el valor automáticamente
```

---

## Rutas de `usuarios.js`

| Método | URL             | Qué hace                      |
| ------ | --------------- | ----------------------------- |
| GET    | `/usuarios`     | Lista todos los usuarios      |
| GET    | `/usuarios/:id` | Obtiene un usuario por ID     |
| POST   | `/usuarios`     | Crea un nuevo usuario         |
| PUT    | `/usuarios/:id` | Actualiza un usuario completo |
| DELETE | `/usuarios/:id` | Elimina un usuario            |

### POST — Crear usuario

```js
router.post("/usuarios", async (req, res) => {
    const { nombre, email, password, rol, telefono } = req.body;
    // req.body tiene los datos enviados en el body de la petición (JSON)

    const [result] = await pool.query(
        "INSERT INTO usuarios (nombre, email, password, rol, telefono) VALUES (?, ?, ?, ?, ?)",
        [nombre, email, password, rol ?? "cliente", telefono ?? null],
    );

    res.status(201).json({
        id: result.insertId,
        message: "Usuario creado correctamente",
    });
});
```

**`req.body`** — datos que el cliente envió en el cuerpo de la petición.
Funciona gracias a `app.use(express.json())` en `index.js`.

**`rol ?? "cliente"`** — operador nullish coalescing: si `rol` es `null` o
`undefined`, usa `"cliente"` como valor por defecto.

**`result.insertId`** — MySQL devuelve el ID autoincremental del registro creado.

**HTTP 201 Created** — código correcto para cuando se crea un recurso nuevo.

### PUT — Actualizar usuario

```js
router.put("/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, email, password, rol, telefono } = req.body;

    const [result] = await pool.query(
        "UPDATE usuarios SET nombre=?, email=?, password=?, rol=?, telefono=? WHERE id=?",
        [nombre, email, password, rol ?? "cliente", telefono ?? null, id],
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario actualizado correctamente" });
});
```

**`result.affectedRows`** — cuántas filas fueron modificadas.
Si es 0, el ID no existe en la tabla.

### DELETE — Eliminar usuario

```js
router.delete("/usuarios/:id", async (req, res) => {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [
        id,
    ]);

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado correctamente" });
});
```

---

## Rutas de `categorias.js` y `productos.js`

Idéntico patrón a usuarios. Campos diferentes según la tabla.

**`productos.js` campos opcionales:**

```js
const { categoria_id, nombre, descripcion, precio, imagen, disponible } =
    req.body;
// categoria_id ?? null  → puede no tener categoría
// descripcion  ?? null  → puede no tener descripción
// imagen       ?? null  → puede no tener imagen
// disponible   ?? true  → por defecto disponible
```

---

## Rutas de `pedidos.js`

```js
const { usuario_id, total, estado, direccion_entrega } = req.body;
// estado ?? "pendiente"  → estado inicial por defecto
```

---

## Rutas de `detalle_pedidos.js`

Este archivo tiene una ruta extra que los demás no tienen:

```js
// Ruta especial: obtener todos los detalles de UN pedido específico
router.get("/detalle_pedidos/pedido/:pedido_id", async (req, res) => {
    const { pedido_id } = req.params;
    const [rows] = await pool.query(
        "SELECT * FROM detalle_pedidos WHERE pedido_id = ?",
        [pedido_id],
    );
    res.json(rows);
    // No hace check de 404 porque un pedido puede tener 0 detalles (array vacío)
});
```

Esta ruta filtra detalles por `pedido_id` — útil para mostrar qué
productos tiene un pedido específico.

---

## Tabla resumen de todos los endpoints

| Recurso         | GET todos              | GET uno                                  | POST                    | PUT                        | DELETE                        |
| --------------- | ---------------------- | ---------------------------------------- | ----------------------- | -------------------------- | ----------------------------- |
| usuarios        | `GET /usuarios`        | `GET /usuarios/:id`                      | `POST /usuarios`        | `PUT /usuarios/:id`        | `DELETE /usuarios/:id`        |
| categorias      | `GET /categorias`      | `GET /categorias/:id`                    | `POST /categorias`      | `PUT /categorias/:id`      | `DELETE /categorias/:id`      |
| productos       | `GET /productos`       | `GET /productos/:id`                     | `POST /productos`       | `PUT /productos/:id`       | `DELETE /productos/:id`       |
| pedidos         | `GET /pedidos`         | `GET /pedidos/:id`                       | `POST /pedidos`         | `PUT /pedidos/:id`         | `DELETE /pedidos/:id`         |
| detalle_pedidos | `GET /detalle_pedidos` | `GET /detalle_pedidos/:id`               | `POST /detalle_pedidos` | `PUT /detalle_pedidos/:id` | `DELETE /detalle_pedidos/:id` |
| (extra)         |                        | `GET /detalle_pedidos/pedido/:pedido_id` |                         |                            |                               |

---

## Códigos HTTP usados

| Código | Nombre                | Cuándo se usa aquí                                 |
| ------ | --------------------- | -------------------------------------------------- |
| 200    | OK                    | GET y DELETE exitoso (por defecto de `res.json()`) |
| 201    | Created               | POST exitoso (recurso creado)                      |
| 404    | Not Found             | El ID no existe en la base de datos                |
| 500    | Internal Server Error | Error inesperado (catch)                           |

---

## Concepto: try/catch en rutas async

```js
router.get("/usuarios", async (req, res) => {
    try {
        // código que puede fallar (query a BD)
        const [rows] = await pool.query("SELECT * FROM usuarios");
        res.json(rows);
    } catch (error) {
        // si algo falla, no crashea el servidor
        res.status(500).json({ error: error.message });
    }
});
```

Sin el `try/catch`, un error en la query haría que Express no enviara
respuesta alguna al cliente (la petición quedaría colgada).
Con `try/catch`, siempre se envía una respuesta, aunque sea de error.
