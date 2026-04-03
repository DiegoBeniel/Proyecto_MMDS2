require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB '))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas
app.use('/api/datos', require('./routes/datos'));
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor de Control de Calidad - Jabón' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
