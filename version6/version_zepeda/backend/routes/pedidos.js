import { Router } from "express";
import pool from "../bd.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM pedidos");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query("SELECT * FROM pedidos WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Pedido no encontrado" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    const { usuario_id, total, estado, direccion_entrega, fecha } = req.body;
    try {
        const [result] = await pool.query(
            "INSERT INTO pedidos (usuario_id, total, estado, direccion_entrega, fecha) VALUES (?, ?, ?, ?, ?)",
            [usuario_id, total, estado, direccion_entrega, fecha]
        );
        res.status(201).json({ message: "Pedido creado!", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { usuario_id, total, estado, direccion_entrega, fecha } = req.body;
    try {
        const [result] = await pool.query(
            "UPDATE pedidos SET usuario_id = ?, total = ?, estado = ?, direccion_entrega = ?, fecha = ? WHERE id = ?",
            [usuario_id, total, estado, direccion_entrega, fecha, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "Pedido no encontrado" });
        res.json({ message: "Pedido actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM pedidos WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Pedido no encontrado" });
        res.json({ message: "Pedido eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;