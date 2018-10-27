var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var redSocialSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    usuario: { type: String, required: [true, 'El urlStreaming es requerido'] },
    password: { type: String },
    idEstacion: { type: String, required: [true, 'La Estacion es requerido'] }

});

module.exports = mongoose.model('redSocial', redSocialSchema);