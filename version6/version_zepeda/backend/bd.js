import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.getConnection()
  .then(connection => {
    console.log("✅ Conexión a la base de datos establecida exitosamente.");
    connection.release(); // Importante liberar la conexión de prueba
  })
  .catch(err => {
    console.error("❌ Error al conectar a la base de datos:", err.message);
  });


export default pool;

