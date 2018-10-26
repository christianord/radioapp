var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var rolesValidos = {
    values: ["ADMIN_ROLE", "USER_ROLE"],
    messege: '{VALUE} no es un role valido'
}
var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    email: { type: String, unique: true, required: [true, 'El correo es requerido'] },
    password: { type: String, required: [true, 'El password es requerido'] },
    img: { type: String },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }

});

usuarioSchema.plugin(uniqueValidator, { message: 'El {path} debe ser unico' });
module.exports = mongoose.model('usuario', usuarioSchema);