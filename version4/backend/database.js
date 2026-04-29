import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
});

pool
	.getConnection()
	.then((connection) => {
		console.log("Database connection succesfully!");
		connection.release();
	})
	.catch((err) => {
		console.error("Database connection error!", err.message);
	});

export default pool;
