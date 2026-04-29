import { Router } from "express";
import pool from "../bd.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM productos");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query("SELECT * FROM productos WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Producto no encontrado" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post("/", async (req, res) => {
    const { categoria_id, nombre, descripcion, precio, imagen, disponible } = req.body;
    try {
        const [result] = await pool.query(
            "INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen, disponible) VALUES (?, ?, ?, ?, ?, ?)",
            [categoria_id, nombre, descripcion, precio, imagen, disponible]
        );
        res.status(201).json({ message: "Producto creado!", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { categoria_id, nombre, descripcion, precio, imagen, disponible } = req.body;
    try {
        const [result] = await pool.query(
            "UPDATE productos SET categoria_id = ?, nombre = ?, descripcion = ?, precio = ?, imagen = ?, disponible = ? WHERE id = ?",
            [categoria_id, nombre, descripcion, precio, imagen, disponible, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "Producto no encontrado" });
        res.json({ message: "Producto actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Producto no encontrado" });
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;