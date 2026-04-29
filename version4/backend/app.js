import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import pool from "./database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3008;

app.use(express.json());
app.use(cors());

app.get("/users", async (req, res) => {
	try {
		const [result] = await pool.query("SELECT * FROM user");
		res.json(result);
	} catch (error) {
		// console.error("Error executing query", error);
		// res.status(500).send("Error executing query");
		res.status(500).json({ error: error.message });
	}
});

app.post("/users", async (req, res) => {
	const [id, name, email] = req.body;
	try {
		const [result] = await pool.query(
			"INSERT INTO user (id, name, email) VALUES (?, ?, ?)",
			[id, name, email],
		);
		res.json(result);
	} catch (error) {}
});

app.put("/users:id", async (req, res) => {
	const { id } = req.params;
	const [name, email] = req.body;
	try {
		const [result] = await pool.query(
			"UPDATE user SET name=?, email=? WHERE id=?",
			[name, email, id],
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Usuario no Encontrado" });
		}

		res.json({ message: "Usuario actualizado correctamente" });
	} catch (error) {
		console.error("Error al actualizar:", error);
		res.status(500).send("Error al actualizar usuario");
	}
});

app.get("/", (req, res) => {
	res.send("Hola!");
});

app.get("/test-db", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT 1 as test");
		res.json({
			succes: true,
			message: "Conexion a la base de datos exitosa!",
			data: rows,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			message: "Error al conectar a la base de datos!",
			error: error.message,
		});
	}
});

app.listen(PORT, () => {
	console.log(`Server Running: http://localhost:${PORT}`);
});
