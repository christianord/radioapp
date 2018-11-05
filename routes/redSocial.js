var express = require('express');
var shared = require('../shared/shared');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var RedSocial = require('../models/redSocial');

// ==========================================
// Obtener todos redesSociales las
// ==========================================
app.get('/', (req, res, next) => {

    //Pagination
    var pageSize = req.query.pageSize || 5; // pageSize Default 5
    pageSize = Number(pageSize);
    var page = Number(page);

    //Sort
    var sort = req.query.sort || '_id'; // sout Default _id
    var dir = req.query.dir || 'asc'; // sort Default asc
    dir = String([dir]);
    var nDir = dir == 'desc' ? -1 : 1;
    sort = String([sort]);
    dataSort = {
        [sort]: nDir
    };

    //Filter 
    var filtro = {}
    RedSocial.schema.eachPath(function(path) {
        var nombre = path.replace('_', '');
        if (req.query.hasOwnProperty(nombre)) {
            filtro[nombre] = req.query[nombre];
        }
    });

    // Columnas resultado 
    var columnas = req.query.columnas || 'nombre';

    // Search
    var searchFilter = {};
    var regex = req.query.search;
    if (regex) {
        let array = columnas.slice();
        regex = new RegExp(String(regex), 'i');
        array.forEach(element => {
            searchFilter[element] = regex;
        });

        //RedSocial.schema.eachPath(function(path) {
        //    var nombre = path.replace('_', '');
        //    searchFilter[nombre] = regex;
        //});
    }


    RedSocial.find(filtro, columnas)
        .and(searchFilter)
        .sort(dataSort)
        .skip(page * pageSize)
        .limit(pageSize)
        .exec(
            (err, las) => {

                if (err) return shared.getResponseError(err, res, 500, 'Error cargando RedSocial');

                RedSocial.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        las: las,
                        total: conteo
                    });
                })

            });
});



// ==========================================
// Actualizar cliente
// ==========================================
app.put('/:id',
    //mdAutenticacion.verificaToken, 
    (req, res) => {

        var id = req.params.id;
        var body = req.body;

        RedSocial.findById(id, (err, redSocial) => {

            if (err) return shared.getResponseError(err, res, 500, 'Error al buscar redSocial');
            if (!redSocial) return shared.getResponseError({ message: 'No existe un redSocial con ese ID' }, res, 400, 'El redSocial con el id ' + id + ' no existe');

            redSocial.nombre = body.nombre;

            redSocial.save((err, redSocialGuardado) => {

                if (err) return shared.getResponseError(err, res, 400, 'Error al actualizar redSocial');

                res.status(200).json({
                    ok: true,
                    redSocial: redSocialGuardado
                });


            });

        });

    });


// ==========================================
// Crear un nuevo redSocial
// ==========================================
app.post('/',
    //mdAutenticacion.verificaToken,
    (req, res) => {

        var body = req.body;

        var redSocial = new RedSocial({
            nombre: body.nombre
        });

        redSocial.save((err, redSocialGuardado) => {

            if (err) return shared.getResponseError(err, res, 400, 'Error al crear redSocial');

            res.status(201).json({
                ok: true,
                redSocial: redSocialGuardado
            });


        });

    });

// ============================================
//   Borrar un redSocial por el id
// ============================================
app.delete('/:id',
    //mdAutenticacion.verificaToken,
    (req, res) => {

        var id = req.params.id;

        RedSocial.findByIdAndRemove(id, (err, redSocialBorrado) => {

            if (err) return shared.getResponseError(err, res, 500, 'Error borrar redSocial');
            if (!redSocialBorrado) return shared.getResponseError({ message: 'No existe un redSocial con ese id' }, res, 400, 'No existe un redSocial con ese id');

            res.status(200).json({
                ok: true,
                redSocial: redSocialBorrado
            });

        });

    });

module.exports = app;