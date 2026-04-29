import { Router } from "express";
import pool from "../bd.js";

const router = Router();


router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM usuario");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post("/", async (req, res) => {
    const { id, nombre, email, password, rol, telefono } = req.body;
    try {
        const [result] = await pool.query(
            "INSERT INTO usuario (id, nombre, email, password, rol, telefono) VALUES (?, ?, ?, ?, ?, ?)",
            [id, nombre, email, password, rol, telefono]
        );
        res.status(201).json({ message: "Usuario creado!", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
});


router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, email } = req.body;
    try {
        const [result] = await pool.query(
            "UPDATE usuario SET nombre = ?, email = ? WHERE id = ?", 
            [nombre, email, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
});


router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query(
            "DELETE FROM usuario WHERE id = ?", [id] 
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json({ message: "Usuario eliminado correctamente!" }); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;