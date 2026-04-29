import dotenv from "dotenv";

dotenv.config();

const API_URL = `http://localhost:${process.env.PORT}`;

document.addEventListener("DOMContentLoaded", () => {
	setTimeout(loadUsers, 800);
});

async function loadUsers() {
	const tbody = document.querySelector("table tbody");

	if (tbody) {
		tbody.innerHTML =
			'<tr><td colspan="6" class="text-center"><i class="fa fa-spinner fe-spin"></i>Cargando usuarios...</td></tr>';
	}

	try {
		console.log("Obteniendo usuarios de:", `${API_URL}/users`);
		const response = await fetch(`${API_URL}/users`);

		if (!response.ok) {
			throw new Error(`Error HTTP: ${response.status}`);
		}

		const users = await response.json()();
		console.log("Usuarios recibidos!", users);
		showUsers(users);
	} catch (error) {
		console.error("Error al cargar usuarios:", error);
		if (tbody) {
			tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">
				<i class="fa fa-exclamation-triangle"></i>Error al cargar ususarios: ${error.message}</td></tr>`;
		}
	}
}

function showUsers(users) {
	const tbody = document.querySelector("table tbody");
	if (!tbody) {
		console.error("No se encontró el tbody de la tabla");
		return;
	}

	tbody.innerHTML = "";

	if (users.length === 0) {
		tbody.innerHTML =
			'<tr><td colspan="6" class="text-center">No hay usuarios registrados en la base de datos</td></tr>';
		return;
	}

	users.forEach((user) => {
		const tr = document.createElement("tr");
		tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nombre || "Sin nombre"}</td>
            <td>${user.email || "Sin email"}</td>
            <td><span class="label label-success">${user.rol || "Usuario"}</span></td>
            <td><span class="label label-success">${user.estado || "Activo"}</span></td>
            <td>
                <button class="btn btn-info btn-xs" onclick="editUser(${user.id})">
                    <i class="fa fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-xs" onclick="deleteUser(${user.id})">
                    <i class="fa fa-trash"></i> Eliminar
                </button>
            </td>
        `;
		tbody.appendChild(tr);
	});
}

async function editUser(id) {
	const name = prompt("Nuevo nombre:");
	const email = prompt("Nuevo email:");

	if (!name || !email) return;

	try {
		const response = await fetch(`${API_URL}/users/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name, email }),
		});

		if (!response.ok) {
			throw new Error("Error al actualizar");
		}

		alert("Usuario actualizado");
		loadUsers();
	} catch (error) {
		console.error("Error:", error);
		alert("Error al actualizar usuario");
	}
}

async function deleteUser(id) {
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
