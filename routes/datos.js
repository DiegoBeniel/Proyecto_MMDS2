const express = require('express');
const router = express.Router();
const Medicion = require('../models/Medicion');
const verificarToken = require('../middleware/auth');

// Recibir dato del sensor (ESP32 o simulador)
router.post('/', async (req, res) => {
  try {
    const { ph, temperatura } = req.body;
    const medicion = new Medicion({ ph, temperatura });
    await medicion.save();
    res.json({ mensaje: 'Dato guardado', medicion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener últimas 100 mediciones (requiere login)
router.get('/', async (req, res) => {
  try {
    const datos = await Medicion.find()
      .sort({ fecha: -1 })
      .limit(100);
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener solo la última medición (para el dashboard en tiempo real)
router.get('/ultima', async (req, res) => {
  try {
    const ultima = await Medicion.findOne().sort({ fecha: -1 });
    res.json(ultima);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
