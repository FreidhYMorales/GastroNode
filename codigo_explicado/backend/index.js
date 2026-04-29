import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import pool from "./bd.js";

import categoriasRoutes from "./routes/categorias.js";
import detallesRoutes from "./routes/detalle_pedidos.js";
import pedidosRoutes from "./routes/pedidos.js";
import productosRoutes from "./routes/productos.js";
import usuariosRoutes from "./routes/usuarios.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
	res.send("Hola!");
});

// Rutas
app.use("/", usuariosRoutes);
app.use("/", pedidosRoutes);
app.use("/", categoriasRoutes);
app.use("/", detallesRoutes);
app.use("/", productosRoutes);

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
