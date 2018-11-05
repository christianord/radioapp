var mongoose = require('mongoose');
var estacionRedSocial = require('../models/estacionRedSocial');
var Schema = mongoose.Schema;

var estacionSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    urlStreaming: { type: String, required: [true, 'El urlStreaming es requerido'] },
    descripcion: { type: String },
    logo: { type: String },
    fondo: { type: String },
    redesSociales: [estacionRedSocial.schema]

});

module.exports = mongoose.model('estacion', estacionSchema);