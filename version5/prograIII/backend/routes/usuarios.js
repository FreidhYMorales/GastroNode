import { Router } from "express";
import pool from "../bd.js";

const router = Router();

router.get("/usuarios", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM usuarios");
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/usuarios/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [
			id,
		]);
		if (rows.length === 0) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}
		res.json(rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/usuarios", async (req, res) => {
	const { nombre, email, password, rol, telefono } = req.body;
	try {
		const [result] = await pool.query(
			"INSERT INTO usuarios (nombre, email, password, rol, telefono) VALUES (?, ?, ?, ?, ?)",
			[nombre, email, password, rol ?? "cliente", telefono ?? null],
		);
		res
			.status(201)
			.json({ id: result.insertId, message: "Usuario creado correctamente" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.put("/usuarios/:id", async (req, res) => {
	const { id } = req.params;
	const { nombre, email, password, rol, telefono } = req.body;
	try {
		const [result] = await pool.query(
			"UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol = ?, telefono = ? WHERE id = ?",
			[nombre, email, password, rol ?? "cliente", telefono ?? null, id],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}
		res.json({ message: "Usuario actualizado correctamente" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.delete("/usuarios/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [
			id,
		]);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}
		res.json({ message: "Usuario eliminado correctamente" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
