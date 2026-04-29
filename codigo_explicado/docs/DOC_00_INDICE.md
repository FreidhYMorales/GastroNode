# GastroNode — Índice de Documentación

Sistema de gestión para restaurante: backend REST con Node.js/Express + MySQL,
frontend HTML con panel de administración AdminLTE.

---

## Módulos de documentación

| Archivo                                                          | Contenido                                                             |
| ---------------------------------------------------------------- | --------------------------------------------------------------------- |
| [DOC_01_ARQUITECTURA.md](./DOC_01_ARQUITECTURA.md)               | Visión general, tecnologías, cómo se conectan las piezas              |
| [DOC_02_BASE_DE_DATOS.md](./DOC_02_BASE_DE_DATOS.md)             | Esquema SQL, tablas, relaciones, llaves foráneas                      |
| [DOC_03_BACKEND_SERVIDOR.md](./DOC_03_BACKEND_SERVIDOR.md)       | `index.js` y `bd.js` — arranque del servidor y pool de conexiones     |
| [DOC_04_BACKEND_RUTAS.md](./DOC_04_BACKEND_RUTAS.md)             | Las 5 rutas REST (usuarios, productos, categorías, pedidos, detalles) |
| [DOC_05_FRONTEND_ESTRUCTURA.md](./DOC_05_FRONTEND_ESTRUCTURA.md) | Páginas HTML, componentes reutilizables, carga dinámica               |
| [DOC_06_FRONTEND_JS.md](./DOC_06_FRONTEND_JS.md)                 | `usuarios.js` — fetch API, render dinámico, CRUD desde el navegador   |

---

## Flujo rápido del sistema

```
Navegador (HTML + JS)
       |
       |  fetch() — HTTP
       v
   Backend Express (puerto 3007)
       |
       |  mysql2/promise
       v
   Base de datos MySQL (gastro)
```

## Cómo correr el proyecto

```bash
# 1. Crear la base de datos
mysql -u root -p < codigo_explicado/db.sql

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor (desarrollo con auto-reload)
npm run dev

# 4. Abrir frontend
# Abrir codigo_explicado/frontend/dashboard.html en el navegador
# (necesita un servidor local como Live Server de VS Code)
```
