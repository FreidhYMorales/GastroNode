1. La Base de Datos (MySQL)
   CREATE DATABASE mi_proyecto;
   USE mi_proyecto;

CREATE TABLE usuarios (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100),
email VARCHAR(100)
);

INSERT INTO usuarios (nombre, email) VALUES ('Juan Pérez', 'juan@example.com'), ('Ana Gómez', 'ana@example.com');

2. El Backend (Node.js + Express)
   Necesitarán instalar dos paquetes: npm install express mysql2 cors.
   Crear un archivo con el nobre
   server.js

```javascript
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(cors()); // Permite que el frontend se conecte
app.use(express.json());

// Configuración de la conexión
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Tu usuario de MySQL
    password: "", // Tu contraseña
    database: "mi_proyecto",
});

// Ruta para obtener los usuarios
app.get("/api/usuarios", (req, res) => {
    db.query("SELECT \* FROM usuarios", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.listen(3000, () =>
    console.log("Servidor corriendo en http://localhost:3000"),
);
```

2. El Frontend
   Hacer un archivo index.php, y escribir

```html
<div class="card">
    <div class="card-header">
        <h3 class="card-title">Lista de Usuarios</h3>
    </div>
    <div class="card-body">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody id="tabla-usuarios"></tbody>
        </table>
    </div>
</div>

<script src="app.js"></script>
```

4. entre front y backend
   Este script hace la petición (fetch) a Node.js y actualiza el index.html
   archivo: app.js

```javascript
async function cargarUsuarios() {
    try {
        const respuesta = await fetch("http://localhost:3000/api/usuarios");
        const usuarios = await respuesta.json();

        const tabla = document.getElementById("tabla-usuarios");
        tabla.innerHTML = ""; // Limpiar tabla

        usuarios.forEach((user) => {
            tabla.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.nombre}</td>
                    <td>${user.email}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error conectando con el backend:", error);
    }
}

// Ejecutar la función al cargar la página
document.addEventListener("DOMContentLoaded", cargarUsuarios);
```

¿Cómo funciona el flujo?

1. El Navegador carga el HTML de AdminLTE.
2. El archivo app.js se ejecuta y hace una petición GET a http://localhost:3000/api/usuarios.
3. Node.js recibe la petición, le pregunta a MySQL por los datos.
4. MySQL responde a Node, y Node envía los datos en formato JSON al navegador.
5. app.js recibe ese JSON y dibuja las filas en la tabla.
