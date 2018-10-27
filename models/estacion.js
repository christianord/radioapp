var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var estacionSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    urlStreaming: { type: String, required: [true, 'El urlStreaming es requerido'] },
    descripcion: { type: String },
    Logo: { type: String },
    Fondo: { type: String }

});

module.exports = mongoose.model('estacion', estacionSchema);