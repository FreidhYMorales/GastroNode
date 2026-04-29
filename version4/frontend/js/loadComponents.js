// Funcion para cargar componentes de forma dinámica
function loadComponents(url, containerId) {
	return fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error("error.log" + url);
			}
			return response.text();
		})
		.then((data) => {
			document.getElementById(containerId).innerHTML = data;
		})
		.catch((error) => {
			console.error("Error fetching" + url, error);
		});
}

document.addEventListener("DOMContentLoaded", () => {
	loadComponents("./components/header.html", "header-container");
	loadComponents("./components/sidebar.html", "sidebar-container");
	loadComponents("./components/content-wrapper.html", "content-container");
	loadComponents("./components/footer.html", "footer-container");
});
