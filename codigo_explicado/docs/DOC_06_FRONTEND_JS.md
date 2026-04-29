# Módulo 06 — Frontend: JavaScript (usuarios.js)

Archivo: `frontend/js/usuarios.js`

---

## Propósito

Este archivo conecta la página `usuarios.html` con la API REST del backend.
Se encarga de:

1. Cargar usuarios desde la API al abrir la página
2. Mostrarlos en la tabla HTML
3. Permitir editar y eliminar desde los botones de la tabla

---

## Constante de configuración

```js
const API_URL = "http://localhost:3000";
```

URL base del backend. Todas las peticiones se construyen agregando la ruta:

```js
`${API_URL}/usuarios` // → "http://localhost:3000/usuarios"
`${API_URL}/usuarios/${id}`; // → "http://localhost:3000/usuarios/5"
```

**Nota:** el `.env` dice `PORT=3007` pero aquí está hardcodeado `3000`.
Si cambia el puerto del backend, hay que actualizar esta línea también.

---

## Iniciación: esperar al DOM

```js
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(cargarUsuarios, 800);
});
```

**`DOMContentLoaded`** — espera a que el HTML esté listo antes de ejecutar código.

**`setTimeout(cargarUsuarios, 800)`** — espera 800ms antes de llamar a `cargarUsuarios`.
Esto da tiempo a que los componentes dinámicos (header, sidebar) terminen de cargarse,
ya que son cargados con `fetch()` y el DOM puede no estar completamente
ensamblado al instante.

> Esta es una solución simple pero frágil. Una mejor alternativa sería
> que `loadComponent()` retorne una promesa y llamar a `cargarUsuarios()`
> dentro del `.then()`.

---

## `cargarUsuarios()` — Función principal

```js
async function cargarUsuarios() {
    const tbody = document.querySelector("table tbody");

    // 1. Mostrar spinner mientras carga
    if (tbody) {
        tbody.innerHTML =
            '<tr><td colspan="6" class="text-center">' +
            '<i class="fa fa-spinner fa-spin"></i> Cargando usuarios...</td></tr>';
    }

    try {
        // 2. Petición GET al backend
        const response = await fetch(`${API_URL}/usuarios`);

        // 3. Verificar si el servidor respondió con error HTTP
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        // 4. Parsear respuesta JSON
        const usuarios = await response.json();

        // 5. Renderizar en la tabla
        mostrarUsuarios(usuarios);
    } catch (error) {
        // 6. Mostrar error en la tabla si algo falla
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">
            <i class="fa fa-exclamation-triangle"></i>
            Error al cargar usuarios: ${error.message}
        </td></tr>`;
    }
}
```

### `fetch()` — La API del navegador para HTTP

```js
const response = await fetch(`${API_URL}/usuarios`);
```

`fetch()` devuelve una Promesa que resuelve con un objeto `Response`.
**No lanza error automáticamente si el servidor responde 404 o 500.**
Por eso se necesita el check manual:

```js
if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
}
// response.ok === true cuando el status está entre 200-299
```

### `.json()` — Parsear la respuesta

```js
const usuarios = await response.json();
```

Convierte el texto JSON de la respuesta en un objeto/array JavaScript.
También es asíncrono (por eso `await`).

```
Backend envía:  '[{"id":1,"nombre":"Ana"}, {"id":2,"nombre":"Luis"}]'
                  (string de texto)
.json() devuelve: [ {id: 1, nombre: "Ana"}, {id: 2, nombre: "Luis"} ]
                  (array de objetos JavaScript)
```

---

## `mostrarUsuarios()` — Renderizar la tabla

```js
function mostrarUsuarios(usuarios) {
    const tbody = document.querySelector("table tbody");

    tbody.innerHTML = ""; // 1. Limpiar contenido anterior

    if (usuarios.length === 0) {
        tbody.innerHTML =
            '<tr><td colspan="6" ...>No hay usuarios registrados</td></tr>';
        return;
    }

    // 2. Crear una fila por cada usuario
    usuarios.forEach((usuario) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre || "Sin nombre"}</td>
            <td>${usuario.email || "Sin email"}</td>
            <td><span class="label label-success">${usuario.rol || "Usuario"}</span></td>
            <td><span class="label label-success">${usuario.estado || "Activo"}</span></td>
            <td>
                <button class="btn btn-info btn-xs"
                        onclick="editarUsuario(${usuario.id})">
                    <i class="fa fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-xs"
                        onclick="eliminarUsuario(${usuario.id})">
                    <i class="fa fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
```

### Template literals (backticks)

```js
tr.innerHTML = `
    <td>${usuario.id}</td>
    <td>${usuario.nombre}</td>
`;
```

Los backticks `` ` `` permiten strings multilínea con interpolación `${}`.
Es más legible que concatenar con `+`.

### `|| "Sin nombre"` — Valor por defecto

```js
${usuario.nombre || "Sin nombre"}
```

Si `usuario.nombre` es `null`, `undefined` o string vacío, usa `"Sin nombre"`.

### `onclick` inline

```html
<button onclick="editarUsuario(5)">Editar</button>
```

Al hacer clic, el navegador ejecuta `editarUsuario(5)`.
El ID del usuario se "hornea" en el HTML en el momento de renderizar la tabla.

---

## `eliminarUsuario()` — Borrar un usuario

```js
async function eliminarUsuario(id) {
    // 1. Confirmar con el usuario antes de borrar
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
        // 2. Petición DELETE al backend
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Error al eliminar");

        alert("Usuario eliminado correctamente");
        cargarUsuarios(); // 3. Recargar la tabla para reflejar el cambio
    } catch (error) {
        alert("Error al eliminar usuario");
    }
}
```

**`confirm()`** — muestra un diálogo con "Aceptar / Cancelar".
Devuelve `true` si aceptó o `false` si canceló.
El `if (!confirm(...)) return` aborta la función si cancela.

**`method: "DELETE"`** — por defecto `fetch()` hace GET.
Para otros métodos HTTP hay que especificarlo en las opciones.

**`cargarUsuarios()`** — recarga los datos de la API para que la tabla
se actualice sin recargar la página completa.

---

## `editarUsuario()` — Actualizar un usuario

```js
async function editarUsuario(id) {
    // 1. Pedir datos con prompts simples
    const nombre = prompt("Nuevo nombre:");
    const email = prompt("Nuevo email:");

    if (!nombre || !email) return; // si cancela o deja vacío, abortar

    try {
        // 2. Petición PUT al backend con los nuevos datos
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json", // indicar que el body es JSON
            },
            body: JSON.stringify({ nombre, email }), // convertir objeto a string JSON
        });

        if (!response.ok) throw new Error("Error al actualizar");

        alert("Usuario actualizado");
        cargarUsuarios(); // 3. Recargar tabla
    } catch (error) {
        alert("Error al actualizar usuario");
    }
}
```

### `headers: { "Content-Type": "application/json" }`

Le dice al backend que el body del request es JSON.
Sin este header, Express no podría parsear el body y `req.body` estaría vacío.

### `JSON.stringify({ nombre, email })`

Convierte el objeto JavaScript en un string JSON para enviarlo:

```js
JSON.stringify({ nombre: "Ana", email: "ana@test.com" });
// → '{"nombre":"Ana","email":"ana@test.com"}'
```

La propiedad `{ nombre, email }` es shorthand de `{ nombre: nombre, email: email }`.

---

## Flujo completo de la página

```
1. Navegador carga usuarios.html
2. DOMContentLoaded → setTimeout(cargarUsuarios, 800)
3. loadComponent carga header, sidebar, footer, scripts
4. 800ms después → cargarUsuarios()
5.   fetch("http://localhost:3000/usuarios") → GET al backend
6.   Backend consulta MySQL → devuelve JSON
7.   mostrarUsuarios(datos) → inyecta filas en <tbody>

[El usuario hace clic en "Eliminar"]
8.   confirm() → acepta
9.   fetch DELETE /usuarios/5
10.  Backend borra de MySQL
11.  cargarUsuarios() recarga la tabla
```

---

## Limitaciones actuales del frontend

| Aspecto            | Estado actual                  | Mejora posible                 |
| ------------------ | ------------------------------ | ------------------------------ |
| Editar             | Usa `prompt()` (feo, limitado) | Usar un modal Bootstrap        |
| Puerto API         | Hardcodeado como 3000          | Usar variable de configuración |
| Espera componentes | `setTimeout(800ms)` frágil     | Usar Promise encadenada        |
| Seguridad          | Sin autenticación              | JWT / sesiones                 |
| XSS                | `innerHTML` con datos de la BD | Sanitizar o usar `textContent` |
