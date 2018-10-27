var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();



var RedSocial = require('../models/redSocial');
//Rustas

//Obtener lista de redSociales
app.get('/', (req, res, next) => {

    RedSocial.find({}, 'nombre email img role')
        .exec(
            (err, redSociales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error buscando redSociales',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    mensaje: 'Peticion redSociales correctamente',
                    redSociales: redSociales
                });
            });


});

//Verificar Token 



//Crear redSocial
app.post('/', (req, res) => {
    var body = req.body;
    var redSocial = new RedSocial({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        img: body.img,
        role: body.role
    });

    redSocial.save((err, redSocialGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            redSocial: redSocialGuardado
        });
    });
});
//EDITAR  mdAutenticacion.verificaToken,
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    RedSocial.findById(id, (err, redSocial) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscar redSocial',
                errors: err
            });
        }

        if (!redSocial) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no se encontro un redSocial',
                errors: err
            });
        }

        redSocial.nombre = body.nombre;
        redSocial.email = body.email;
        redSocial.role = body.role;

        redSocial.save((err, redSocialActualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el redSocial',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                redSocial: redSocialActualizado
            });
        });
    });
});
//Eliminar redSocial  mdAutenticacion.verificaToken,
app.delete('/:id', (req, res) => {
    var id = req.params.id;

    RedSocial.findByIdAndRemove(id, (err, redSocialEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar el redSocial',
                errors: err
            });
        }

        if (!redSocialEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no se encontro un redSocial',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            redSocial: redSocialEliminado
        });
    });
});
module.exports = app;