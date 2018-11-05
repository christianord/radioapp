var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var estacionRedSocialSchema = new Schema({

    redSocial: { type: mongoose.Schema.Types.ObjectId, ref: 'redSocial' },
    usuario: { type: String, required: [true, 'El usuario es requerido'] },
    password: { type: String }

});

module.exports = mongoose.model('estacionRedSocial', estacionRedSocialSchema);