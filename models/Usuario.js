const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true }, //unique es para que no se repita
  password: { type: String, required: true },
  rol: {
    type: String,
    enum: ['operador', 'calidad', 'admin'],
    default: 'operador'
  },
  fechaCreacion: { type: Date, default: Date.now }
});

// Encripta la contraseña antes de guardar
usuarioSchema.pre('save', async function() {
  if (!this.isModified('password')) return; //si no cambio la contraseña no haga nada
  this.password = await bcrypt.hash(this.password, 10);
});

// Método para verificar contraseña en el login
usuarioSchema.methods.verificarPassword = async function(passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);