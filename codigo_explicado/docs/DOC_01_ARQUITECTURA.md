# Módulo 01 — Arquitectura del Proyecto

## ¿Qué es GastroNode?

Una aplicación web de gestión para un restaurante.
Permite administrar usuarios, productos, categorías y pedidos desde un panel web.

---

## Tecnologías usadas

### Backend

| Tecnología         | Rol                                                                          |
| ------------------ | ---------------------------------------------------------------------------- |
| **Node.js**        | Entorno de ejecución JavaScript en el servidor                               |
| **Express 5**      | Framework web — maneja rutas HTTP                                            |
| **mysql2/promise** | Driver para conectarse a MySQL desde Node.js                                 |
| **dotenv**         | Leer variables de entorno desde `.env`                                       |
| **cors**           | Permite que el frontend (en otro origen) haga peticiones al backend          |
| **nodemon**        | Reinicia el servidor automáticamente al guardar cambios (solo en desarrollo) |

### Frontend

| Tecnología               | Rol                                                         |
| ------------------------ | ----------------------------------------------------------- |
| **HTML5**                | Estructura de las páginas                                   |
| **AdminLTE 2**           | Template de panel de administración (basado en Bootstrap 3) |
| **Bootstrap 3**          | Sistema de grid y componentes visuales                      |
| **Font Awesome**         | Iconos                                                      |
| **JavaScript (vanilla)** | Lógica del frontend, llamadas a la API con `fetch()`        |

### Base de datos

| Tecnología | Rol                               |
| ---------- | --------------------------------- |
| **MySQL**  | Motor de base de datos relacional |

---

## Estructura de carpetas

```
codigo_explicado/
├── backend/
│   ├── .env                  ← Variables de entorno (puerto, credenciales BD)
│   ├── bd.js                 ← Conexión a la base de datos (pool)
│   ├── index.js              ← Punto de entrada del servidor
│   └── routes/
│       ├── categorias.js     ← CRUD de categorías
│       ├── detalle_pedidos.js← CRUD de detalles de pedidos
│       ├── pedidos.js        ← CRUD de pedidos
│       ├── productos.js      ← CRUD de productos
│       └── usuarios.js       ← CRUD de usuarios
├── frontend/
│   ├── components/
│   │   ├── header.html       ← Barra de navegación superior (reutilizable)
│   │   ├── sidebar.html      ← Menú lateral (reutilizable)
│   │   ├── footer.html       ← Pie de página (reutilizable)
│   │   └── scripts.html      ← Scripts JS compartidos (reutilizable)
│   ├── css/                  ← Estilos propios del proyecto
│   ├── js/
│   │   └── usuarios.js       ← Lógica JS para la página de usuarios
│   ├── Admin/                ← Librería AdminLTE (no se modifica)
│   ├── dashboard.html        ← Página principal del panel
│   └── usuarios.html         ← Página de gestión de usuarios
├── db.sql                    ← Script SQL para crear la base de datos
└── package.json              ← Configuración del proyecto Node.js
```

---

## Arquitectura: separación de responsabilidades

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND (navegador)                                   │
│                                                         │
│  dashboard.html / usuarios.html                         │
│       └── carga componentes dinámicos (fetch HTML)      │
│                                                         │
│  js/usuarios.js                                         │
│       └── hace fetch() al backend → muestra datos       │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (JSON)
                         │ GET /usuarios
                         │ POST /usuarios
                         │ PUT /usuarios/:id
                         │ DELETE /usuarios/:id
┌────────────────────────▼────────────────────────────────┐
│  BACKEND (Node.js + Express)                            │
│                                                         │
│  index.js  ← punto de entrada, registra rutas           │
│  bd.js     ← pool de conexiones MySQL                   │
│  routes/   ← un archivo por recurso (tabla)             │
└────────────────────────┬────────────────────────────────┘
                         │ SQL queries
┌────────────────────────▼────────────────────────────────┐
│  BASE DE DATOS MySQL                                    │
│                                                         │
│  categorias → productos → pedidos → detalle_pedidos     │
│  usuarios                                               │
└─────────────────────────────────────────────────────────┘
```

---

## Patrón de diseño: REST API

El backend expone una **API REST**: cada recurso (usuarios, productos, etc.)
tiene sus propias URLs y responde con JSON.

| Método HTTP | Acción     | Ejemplo                             |
| ----------- | ---------- | ----------------------------------- |
| `GET`       | Leer       | `GET /usuarios` → lista de usuarios |
| `POST`      | Crear      | `POST /usuarios` + body JSON        |
| `PUT`       | Actualizar | `PUT /usuarios/5` + body JSON       |
| `DELETE`    | Eliminar   | `DELETE /usuarios/5`                |

---

## ¿Qué es ESModules (`"type": "module"`)?

El `package.json` tiene `"type": "module"`. Esto activa los módulos ES modernos:

- Se usa `import` en lugar de `require()`
- Se usa `export default` en lugar de `module.exports`

```js
// Sintaxis moderna (ESModules) — lo que usa este proyecto
import express from "express";
export default router;

// Sintaxis antigua (CommonJS) — no se usa aquí
const express = require("express");
module.exports = router;
```
