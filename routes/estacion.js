var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();



var Estacion = require('../models/estacion');
//Rustas

//Obtener lista de estaciones
app.get('/', (req, res, next) => {

    Estacion.find({}, 'nombre email img role')
        .exec(
            (err, estaciones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error buscando estaciones',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    mensaje: 'Peticion estaciones correctamente',
                    estaciones: estaciones
                });
            });


});

//Verificar Token 



//Crear estacion
app.post('/', (req, res) => {
    var body = req.body;
    var estacion = new Estacion({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        img: body.img,
        role: body.role
    });

    estacion.save((err, estacionGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            estacion: estacionGuardado
        });
    });
});
//EDITAR  mdAutenticacion.verificaToken,
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Estacion.findById(id, (err, estacion) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscar estacion',
                errors: err
            });
        }

        if (!estacion) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no se encontro un estacion',
                errors: err
            });
        }

        estacion.nombre = body.nombre;
        estacion.email = body.email;
        estacion.role = body.role;

        estacion.save((err, estacionActualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el estacion',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                estacion: estacionActualizado
            });
        });
    });
});
//Eliminar estacion  mdAutenticacion.verificaToken,
app.delete('/:id', (req, res) => {
    var id = req.params.id;

    Estacion.findByIdAndRemove(id, (err, estacionEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar el estacion',
                errors: err
            });
        }

        if (!estacionEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no se encontro un estacion',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            estacion: estacionEliminado
        });
    });
});
module.exports = app;