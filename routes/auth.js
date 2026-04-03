const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Registro
router.post('/registro', async (req, res) => {
  try {
    const { nombre, password, rol } = req.body;

    // Buscar si ya existe el usuario por nombre
    const existe = await Usuario.findOne({ nombre });
    if (existe) return res.status(400).json({ error: 'Usuario ya registrado' });

    const usuario = new Usuario({ nombre, password, rol });
    await usuario.save();

    res.json({ mensaje: 'Usuario creado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { nombre, password } = req.body;

    const usuario = await Usuario.findOne({ nombre });
    if (!usuario) return res.status(400).json({ error: 'Usuario no encontrado' });

    const passwordCorrecta = await usuario.verificarPassword(password);
    if (!passwordCorrecta) return res.status(400).json({ error: 'Contraseña incorrecta' });

    // Token
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: { nombre: usuario.nombre, rol: usuario.rol }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;