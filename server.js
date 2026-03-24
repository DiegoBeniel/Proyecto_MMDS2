const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 "Base de datos" temporal
let datos = [];

// 🔹 Ruta para recibir datos (como si fuera el ESP32)
app.post("/api/datos", (req, res) => {
    const nuevoDato = {
        ph: req.body.ph,
        temperatura: req.body.temperatura,
        fecha: new Date()
    };

    datos.push(nuevoDato);

    console.log("Dato recibido:", nuevoDato);

    res.json({ mensaje: "Dato guardado correctamente" });
});

// 🔹 Ruta para obtener datos
app.get("/api/datos", (req, res) => {
    res.json(datos);
});

// 🔹 Ruta de prueba
app.get("/", (req, res) => {
    res.send("Servidor funcionando 🚀");
});

// 🔹 Levantar servidor
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});