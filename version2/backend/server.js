const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

const PORT = 3007 || 3008;

app.use(cors());
app.use(express.json());

//Base de Datos
const db = mysql.createConnection({
	host: "localhost",
	user: "user_test",
	password: "test",
	database: "gastronode_db",
});

// app.get("/", (req, res) => {
// 	res.send("Hola Mundo!");
// });

app.get("/api/users", (req, res) => {
	db.query("SELECT * FROM user", (err, result) => {
		if (err) return res.status(500).send(err);
		res.json(result);
	});
});

app.listen(PORT, () => {
	console.log(`Server on. Running on: http://localhost:${PORT}`);
});
