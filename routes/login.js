var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


var SEED = require('../config/config').SEED;
var app = express();
var Usuario = require('../models/Usuario');


app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'credencial incorrecta - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'credencial incorrecta - pass',
                errors: err
            });
        }

        usuarioDB.password = ".I.";
        // Crear token
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });
        res.status(200).json({
            ok: true,
            mensaje: 'login Correcto',
            id: usuarioDB.id,
            usuario: usuarioDB,
            token: token
        });


    });


});

module.exports = app;