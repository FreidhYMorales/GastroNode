import { Router } from "express";
import pool from "../bd.js";

const router = Router();

router.get("/categorias", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM categorias");
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/categorias/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [rows] = await pool.query("SELECT * FROM categorias WHERE id = ?", [
			id,
		]);
		if (rows.length === 0) {
			return res.status(404).json({ message: "Categoría no encontrada" });
		}
		res.json(rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/categorias", async (req, res) => {
	const { nombre, imagen } = req.body;
	try {
		const [result] = await pool.query(
			"INSERT INTO categorias (nombre, imagen) VALUES (?, ?)",
			[nombre, imagen ?? null],
		);
		res
			.status(201)
			.json({ id: result.insertId, message: "Categoría creada correctamente" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.put("/categorias/:id", async (req, res) => {
	const { id } = req.params;
	const { nombre, imagen } = req.body;
	try {
		const [result] = await pool.query(
			"UPDATE categorias SET nombre = ?, imagen = ? WHERE id = ?",
			[nombre, imagen ?? null, id],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Categoría no encontrada" });
		}
		res.json({ message: "Categoría actualizada correctamente" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.delete("/categorias/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [result] = await pool.query("DELETE FROM categorias WHERE id = ?", [
			id,
		]);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Categoría no encontrada" });
		}
		res.json({ message: "Categoría eliminada correctamente" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
