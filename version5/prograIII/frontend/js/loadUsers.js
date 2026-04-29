fetch("/api/usuarios")
	.then((response) => response.json())
	.then((data) => {
		const table = document.getElementById("users");
		table.innerHTML = data
			.map(
				(user) => `
			<tr>
				<td>${user.id}</td>
				<td>${user.nombre}</td>
				<td>${user.email}</td>
				<td>${user.password}</td>
				<td>${user.rol}</td>
				<td>${user.telefono}</td>
				<td>${user.created_at}</td>
			</tr>
			`,
			)
			.join("");
	})
	.catch((err) => {
		alert("Error: " + err.message);
	});
