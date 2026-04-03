const mongoose = require('mongoose');

const medicionSchema = new mongoose.Schema({
  ph: {
    type: Number,
    required: true
  },
  temperatura: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['OK', 'ALERTA'],
    default: 'OK'
  }
});

//función para antes de guardarla en MongoDB, verifica el estado de los datos (esto para las alertas)
medicionSchema.pre('save', function() {
  const phFuera = this.ph < 5.0 || this.ph > 7.0;
  const tempFuera = this.temperatura < 20 || this.temperatura > 40;
  this.estado = (phFuera || tempFuera) ? 'ALERTA' : 'OK';
});

module.exports = mongoose.model('Medicion', medicionSchema);