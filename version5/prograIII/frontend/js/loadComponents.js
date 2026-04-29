// Función para cargar componentes HTML
function loadComponent(url, containerId) {
	return fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Error loading " + url);
			}
			return response.text();
		})
		.then((data) => {
			const container = document.getElementById(containerId);
			if (container) {
				container.innerHTML = data;
			}
		})
		.catch((error) => {
			console.error("Error:", error);
			const container = document.getElementById(containerId);
			if (container) {
				container.innerHTML =
					'<p style="color:red">Error cargando ' + url + "</p>";
			}
		});
}

// Cargar todos los componentes cuando la página esté lista
document.addEventListener("DOMContentLoaded", () => {
	Promise.all([
		loadComponent("./components/header.html", "header-container"),
		loadComponent("./components/sidebar.html", "sidebar-container"),
		loadComponent("./components/footer.html", "footer-container"),
		loadComponent("./components/scripts.html", "scripts-container"),
	])
		.then(() => {
			console.log("Todos los componentes cargados correctamente");

			// Marcar el menú de usuarios como activo
			const userMenu = document.querySelector(".sidebar-menu li:nth-child(3)");
			const dashboardMenu = document.querySelector(
				".sidebar-menu li:nth-child(2)",
			);
			if (userMenu && dashboardMenu) {
				dashboardMenu.classList.remove("active");
				userMenu.classList.add("active");
			}
		})
		.catch((error) => {
			console.error("Error cargando componentes:", error);
		});
});
