# Módulo 05 — Frontend: Estructura HTML y Componentes

Archivos: `frontend/*.html` y `frontend/components/*.html`

---

## Template AdminLTE

El frontend usa **AdminLTE 2**, un template de panel de administración de código abierto.
AdminLTE está construido sobre Bootstrap 3 y proporciona:

- Layout de sidebar + header + content area
- Componentes visuales (boxes, tablas, badges)
- Sistema de skin/color (skin-blue, skin-red, etc.)

Los archivos de AdminLTE están en `frontend/Admin/` y **no se modifican**.
Solo se usan sus clases CSS.

---

## Patrón de componentes dinámicos

En lugar de copiar el header y sidebar en cada página, el proyecto usa
**componentes HTML cargados dinámicamente** con `fetch()`.

### Problema que resuelve

```
Sin componentes:
  dashboard.html  → copia de header + sidebar + footer
  usuarios.html   → copia de header + sidebar + footer
  productos.html  → copia de header + sidebar + footer
  (si cambias el logo, debes editar 10 archivos)

Con componentes:
  components/header.html  ← un solo lugar
  components/sidebar.html ← un solo lugar
  dashboard.html  → div vacío + script que lo carga
  usuarios.html   → div vacío + script que lo carga
```

### Cómo funciona

Cada página tiene divs contenedores vacíos:

```html
<div id="header-container"></div>
<div id="sidebar-container"></div>
<div id="footer-container"></div>
<div id="scripts-container"></div>
```

Y un script que los llena al cargar:

```js
function loadComponent(url, containerId) {
    return fetch(url) // 1. Pide el archivo HTML
        .then((response) => {
            if (!response.ok) throw new Error("Error loading " + url);
            return response.text(); // 2. Lo convierte a string
        })
        .then((data) => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = data; // 3. Lo inyecta en el div
            }
        })
        .catch((error) => {
            // 4. Si falla, muestra mensaje de error en rojo
            container.innerHTML =
                '<p style="color:red">Error cargando ' + url + "</p>";
        });
}
```

Luego se cargan todos en paralelo con `Promise.all`:

```js
document.addEventListener("DOMContentLoaded", function () {
    Promise.all([
        loadComponent("./components/header.html", "header-container"),
        loadComponent("./components/sidebar.html", "sidebar-container"),
        loadComponent("./components/footer.html", "footer-container"),
        loadComponent("./components/scripts.html", "scripts-container"),
    ]).then(() => {
        console.log("Todos los componentes cargados correctamente");
    });
});
```

**`DOMContentLoaded`** — evento que dispara cuando el HTML está parseado
(antes de que carguen imágenes y estilos).

**`Promise.all([...])`** — lanza todas las peticiones en paralelo y espera
a que TODAS terminen. Es más rápido que esperarlas una por una.

---

## `components/header.html`

```html
<header class="main-header">
    <a href="./dashboard.html" class="logo">
        <span class="logo-mini"><b>A</b>LT</span>
        <span class="logo-lg"><b>Admin</b>LTE</span>
    </a>
    <nav class="navbar navbar-static-top">
        <a href="#" class="sidebar-toggle" data-toggle="push-menu">...</a>
        <div class="navbar-custom-menu">
            <!-- menú de usuario con avatar -->
        </div>
    </nav>
</header>
```

Es solo HTML puro — sin `<html>`, `<head>`, ni `<body>`.
Se inyecta como fragmento dentro del contenedor de la página.

**`data-toggle="push-menu"`** — atributo de AdminLTE que activa el
botón para colapsar/expandir el sidebar en móviles.

---

## `components/sidebar.html`

```html
<aside class="main-sidebar">
    <section class="sidebar">
        <!-- Panel del usuario -->
        <div class="user-panel">...</div>

        <!-- Menú de navegación -->
        <ul class="sidebar-menu">
            <li class="header">MENÚ PRINCIPAL</li>
            <li class="active">
                <a href="./dashboard.html"
                    ><i class="fa fa-dashboard"></i> Dashboard</a
                >
            </li>
            <li>
                <a href="./usuarios.html"
                    ><i class="fa fa-users"></i> Usuarios</a
                >
            </li>
            <li>
                <a href="#"><i class="fa fa-cog"></i> Configuración</a>
            </li>
        </ul>
    </section>
</aside>
```

**`class="active"`** — AdminLTE resalta visualmente el ítem activo.
Cada página puede ajustar esto con JS después de cargar el sidebar.

**`<i class="fa fa-dashboard">`** — iconos de Font Awesome.
`fa` = Font Awesome, `fa-dashboard` = icono de dashboard.

---

## `usuarios.html` — Página de gestión de usuarios

### Estructura de la página

```
<head>       → estilos CSS (Bootstrap, AdminLTE, Font Awesome)
<body>
  ├── <div id="header-container">   → se llena con header.html
  ├── <div id="sidebar-container">  → se llena con sidebar.html
  ├── <div class="content-wrapper"> → CONTENIDO PROPIO
  │     ├── section.content-header  → título + breadcrumb
  │     └── section.content
  │           └── tabla de usuarios
  ├── <div id="footer-container">
  ├── <div id="scripts-container">
  └── <script>                      → carga los componentes
```

### La tabla de usuarios

```html
<table class="table table-bordered table-striped">
    <thead>
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        <!-- filas estáticas de ejemplo (se reemplazan con JS) -->
        <tr>
            <td>1</td>
            <td>Alexander Pierce</td>
            ...
        </tr>
    </tbody>
</table>
```

La tabla tiene filas **hardcodeadas** de ejemplo en el HTML.
Cuando `usuarios.js` cargue, las reemplaza con datos reales de la API.

**`table-bordered`** — Bootstrap agrega bordes a la tabla.  
**`table-striped`** — Bootstrap alterna fondo gris/blanco por fila.

### Botón "Agregar Usuario"

```html
<button
    class="btn btn-primary btn-sm"
    data-toggle="modal"
    data-target="#modal-agregar"
>
    <i class="fa fa-plus"></i> Agregar Usuario
</button>
```

**`data-toggle="modal"` y `data-target="#modal-agregar"`** —
atributos de Bootstrap que abren un modal (ventana popup) cuando se hace clic.
El modal con id `modal-agregar` debería estar definido en la página
(actualmente no está implementado en el HTML).

### Marcado del ítem activo en el sidebar

```js
.then(() => {
    // Después de cargar el sidebar, marca "Usuarios" como activo
    const userMenu      = document.querySelector(".sidebar-menu li:nth-child(3)");
    const dashboardMenu = document.querySelector(".sidebar-menu li:nth-child(2)");
    if (userMenu && dashboardMenu) {
        dashboardMenu.classList.remove("active");
        userMenu.classList.add("active");
    }
})
```

Se ejecuta DESPUÉS de que el sidebar fue inyectado en el DOM.
**`li:nth-child(3)`** — el tercer `<li>` dentro del sidebar (el de Usuarios).

---

## `components/scripts.html`

Contiene los `<script>` de la plantilla AdminLTE (jQuery, Bootstrap JS, adminlte.js y plugins).
Se inyecta al final del `<body>` para que los scripts de la plantilla estén disponibles
en todas las páginas sin duplicarlos.

No contiene lógica propia del proyecto — es infraestructura del template.

---

## `dashboard.html`

Página mínima — solo carga los componentes y muestra un mensaje de bienvenida.
Aún no tiene contenido funcional (cards de estadísticas, gráficas, etc.).

---

## Diferencias de rutas entre páginas

```html
<!-- dashboard.html está en frontend/ -->
<link href="./Admin/..." /> ← ruta relativa desde frontend/
loadComponent("./components/...");

<!-- usuarios.html también está en frontend/ -->
<link href="./Admin/..." /> ← igual
```

Si existiera una página en `frontend/Admin/`, los paths serían distintos
(`../components/...`). Es importante mantener todas las páginas al mismo nivel.
