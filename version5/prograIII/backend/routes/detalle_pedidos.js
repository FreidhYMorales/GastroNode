import { Router } from "express";
import pool from "../bd.js";

const router = Router();

router.get("/detalle_pedidos", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM detalle_pedidos");
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/detalle_pedidos/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [rows] = await pool.query(
			"SELECT * FROM detalle_pedidos WHERE id = ?",
			[id],
		);
		if (rows.length === 0) {
			return res.status(404).json({ message: "Detalle no encontrado" });
		}
		res.json(rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/detalle_pedidos/pedido/:pedido_id", async (req, res) => {
	const { pedido_id } = req.params;
	try {
		const [rows] = await pool.query(
			"SELECT * FROM detalle_pedidos WHERE pedido_id = ?",
			[pedido_id],
		);
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/detalle_pedidos", async (req, res) => {
	const { pedido_id, producto_id, cantidad, precio_unitario } = req.body;
	try {
		const [result] = await pool.query(
			"INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
			[pedido_id ?? null, producto_id ?? null, cantidad, precio_unitario],
		);
		res
			.status(201)
			.json({ id: result.insertId, message: "Detalle creado correctamente" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.put("/detalle_pedidos/:id", async (req, res) => {
	const { id } = req.params;
	const { pedido_id, producto_id, cantidad, precio_unitario } = req.body;
	try {
		const [result] = await pool.query(
			"UPDATE detalle_pedidos SET pedido_id = ?, producto_id = ?, cantidad = ?, precio_unitario = ? WHERE id = ?",
			[pedido_id ?? null, producto_id ?? null, cantidad, precio_unitario, id],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Detalle no encontrado" });
		}
		res.json({ message: "Detalle actualizado correctamente" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.delete("/detalle_pedidos/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [result] = await pool.query(
			"DELETE FROM detalle_pedidos WHERE id = ?",
			[id],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Detalle no encontrado" });
		}
		res.json({ message: "Detalle eliminado correctamente" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
