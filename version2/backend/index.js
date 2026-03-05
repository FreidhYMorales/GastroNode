const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3007 || 3008;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.send("Hola Mundo");
});

app.listen(PORT, () =>
	console.log(`Servidor en puerto: http://localhost:${PORT}/`),
);
