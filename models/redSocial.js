var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var redSocialSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es requerido'] }

});

module.exports = mongoose.model('redSocial', redSocialSchema);