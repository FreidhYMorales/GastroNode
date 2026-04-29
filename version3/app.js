import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2/promise";

dotenv.config();
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3008;
let db_connection; // <= Declaracion de la conexion fuera de cualquier funcion para tener acceso en cualquier lado

// La sintaxis de como deberia de hacerse la conexion con la base de datos es la siguiente:
const db = async () => {
	db_connection = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
	});
	console.log("Database Connection OK!");
};

// La sintaxis de como se hace la solicitud a la base de datos es la siguiente:
app.get("/api/users", async (req, res) => {
	try {
		const [result] = await db_connection.query("SELECT * FROM user");
		res.json(result);
	} catch (error) {
		console.error("Error executing query", error);
		res.status(500).send("Error executing query");
	}
});

// Primero se hace la conexion a la base de datos y luego se levanta el servidor
// sintaxis correcta:
db()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server Running on: http://localhost:${PORT}`);
		});
	})
	.catch((error) => {
		console.error("Database Connection FAILED!", error);
		process.exit(1);
	});
