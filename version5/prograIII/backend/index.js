import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./bd.js";
import categoriasRoutes from "./routes/categorias.js";
import detallesRoutes from "./routes/detalle_pedidos.js";
import pedidosRoutes from "./routes/pedidos.js";
import productosRoutes from "./routes/productos.js";
import usuariosRoutes from "./routes/usuarios.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/usuarios", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/usuarios.html"));
});

app.get("/dashboard", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/dashboard.html"));
});

// Rutas
app.use("/api", usuariosRoutes);
app.use("/api", pedidosRoutes);
app.use("/api", categoriasRoutes);
app.use("/api", detallesRoutes);
app.use("/api", productosRoutes);

// Endpoint para testear conexión a la BD
app.get("/test-db", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT 1 as test");
		res.json({
			success: true,
			message: "Conexión a la base de datos exitosa",
			data: rows,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error al conectar a la base de datos",
			error: error.message,
		});
	}
});

app.listen(port, () => {
	console.log(`Server on: http://localhost:${port}`);
});
