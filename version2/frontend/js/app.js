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
