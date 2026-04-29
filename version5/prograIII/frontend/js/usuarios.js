// URL del backend
const API_URL = "http://localhost:3007";

// Cargar usuarios cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
	// Esperar a que los componentes se carguen primero
	setTimeout(cargarUsuarios, 800);
});

// Función para obtener usuarios del backend
async function cargarUsuarios() {
	const tbody = document.querySelector("table tbody");

	// Mostrar mensaje de carga
	if (tbody) {
		tbody.innerHTML =
			'<tr><td colspan="6" class="text-center"><i class="fa fa-spinner fa-spin"></i> Cargando usuarios...</td></tr>';
	}

	try {
		console.log("Obteniendo usuarios de:", `${API_URL}/usuarios`);
		const response = await fetch(`${API_URL}/usuarios`);

		if (!response.ok) {
			throw new Error(`Error HTTP: ${response.status}`);
		}

		const usuarios = await response.json();
		console.log("Usuarios recibidos:", usuarios);
		mostrarUsuarios(usuarios);
	} catch (error) {
		console.error("Error al cargar usuarios:", error);
		if (tbody) {
			tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">
                <i class="fa fa-exclamation-triangle"></i> Error al cargar usuarios: ${error.message}
            </td></tr>`;
		}
	}
}

// Función para mostrar usuarios en la tabla
function mostrarUsuarios(usuarios) {
	const tbody = document.querySelector("table tbody");
	if (!tbody) {
		console.error("No se encontró el tbody de la tabla");
		return;
	}

	tbody.innerHTML = "";

	if (usuarios.length === 0) {
		tbody.innerHTML =
			'<tr><td colspan="6" class="text-center">No hay usuarios registrados en la base de datos</td></tr>';
		return;
	}

	usuarios.forEach((usuario) => {
		const tr = document.createElement("tr");
		tr.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre || "Sin nombre"}</td>
            <td>${usuario.email || "Sin email"}</td>
            <td><span class="label label-success">${usuario.rol || "Usuario"}</span></td>
            <td><span class="label label-success">${usuario.estado || "Activo"}</span></td>
            <td>
                <button class="btn btn-info btn-xs" onclick="editarUsuario(${usuario.id})">
                    <i class="fa fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-xs" onclick="eliminarUsuario(${usuario.id})">
                    <i class="fa fa-trash"></i> Eliminar
                </button>
            </td>
        `;
		tbody.appendChild(tr);
	});
}

// Función para eliminar usuario
async function eliminarUsuario(id) {
	if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

	try {
		const response = await fetch(`${API_URL}/usuarios/${id}`, {
			method: "DELETE",
		});

		if (!response.ok) {
			throw new Error("Error al eliminar");
		}

		alert("Usuario eliminado correctamente");
		cargarUsuarios();
	} catch (error) {
		console.error("Error:", error);
		alert("Error al eliminar usuario");
	}
}

// Función para editar usuario
async function editarUsuario(id) {
	const nombre = prompt("Nuevo nombre:");
	const email = prompt("Nuevo email:");

	if (!nombre || !email) return;

	try {
		const response = await fetch(`${API_URL}/usuarios/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ nombre, email }),
		});

		if (!response.ok) {
			throw new Error("Error al actualizar");
		}

		alert("Usuario actualizado");
		cargarUsuarios();
	} catch (error) {
		console.error("Error:", error);
		alert("Error al actualizar usuario");
	}
}
