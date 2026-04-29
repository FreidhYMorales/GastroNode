import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./bd.js";


import usuariosRoutes from "./routes/usuarios.js";
import productosRoutes from "./routes/productos.js";
import categoriasRoutes from "./routes/categorias.js";
import pedidosRoutes from "./routes/pedidos.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.static( 'frontend'));


app.use("/usuarios", usuariosRoutes);
app.use("/productos", productosRoutes);
app.use("/categorias", categoriasRoutes);
app.use("/pedidos", pedidosRoutes);

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hola!");
});

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 as test");
    res.json({ success: true, message: "Conexión a la base de datos exitosa", data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al conectar a la base de datos", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});