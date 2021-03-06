var express = require('express');
var shared = require('../shared/shared');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Estacion = require('../models/estacion');
var EstacionRedsocial = require('../models/estacionRedSocial');

// ==========================================
// Obtener todos estaciones las
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
    Estacion.schema.eachPath(function(path) {
        var nombre = path.replace('_', '');
        if (req.query.hasOwnProperty(nombre)) {
            filtro[nombre] = req.query[nombre];
        }
    });

    // Columnas resultado 
    var columnas = req.query.columnas || 'nombre urlStriming descripcion logo fondo';

    // Search
    var searchFilter = {};
    var regex = req.query.search;
    if (regex) {
        let array = columnas.slice();
        regex = new RegExp(String(regex), 'i');
        array.forEach(element => {
            searchFilter[element] = regex;
        });

        //Estacion.schema.eachPath(function(path) {
        //    var nombre = path.replace('_', '');
        //    searchFilter[nombre] = regex;
        //});
    }


    Estacion.find(filtro, columnas)
        .and(searchFilter)
        .sort(dataSort)
        .skip(page * pageSize)
        .limit(pageSize)
        //.populate('usuario', 'nombre email')
        .exec(
            (err, las) => {

                if (err) return shared.getResponseError(err, res, 500, 'Error cargando Estacion');

                Estacion.count({}, (err, conteo) => {

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

        Estacion.findById(id, (err, estacion) => {

            if (err) return shared.getResponseError(err, res, 500, 'Error al buscar estacion');
            if (!estacion) return shared.getResponseError({ message: 'No existe un estacion con ese ID' }, res, 400, 'El estacion con el id ' + id + ' no existe');

            estacion.nombre = body.nombre;
            estacion.urlStreaming = body.urlStreaming;
            estacion.descripcion = body.descripcion;
            estacion.logo = body.logo;
            estacion.fondo = body.fondo;

            estacion.save((err, estacionGuardado) => {

                if (err) return shared.getResponseError(err, res, 400, 'Error al actualizar estacion');

                res.status(200).json({
                    ok: true,
                    estacion: estacionGuardado
                });


            });

        });

    });


// ==========================================
// Crear un nuevo estacion
// ==========================================
app.post('/',
    //mdAutenticacion.verificaToken,
    (req, res) => {

        var body = req.body;

        var estacion = new Estacion({
            nombre: body.nombre,
            urlStreaming: body.urlStreaming,
            descripcion: body.descripcion,
            logo: body.logo,
            fondo: body.fondo
        });

        estacion.save((err, estacionGuardado) => {

            if (err) return shared.getResponseError(err, res, 400, 'Error al crear estacion');

            res.status(201).json({
                ok: true,
                estacion: estacionGuardado
            });


        });

    });

// ============================================
//   Borrar un estacion por el id
// ============================================
app.delete('/:id',
    //mdAutenticacion.verificaToken,
    (req, res) => {

        var id = req.params.id;

        Estacion.findByIdAndRemove(id, (err, estacionBorrado) => {

            if (err) return shared.getResponseError(err, res, 500, 'Error borrar estacion');
            if (!estacionBorrado) return shared.getResponseError({ message: 'No existe un estacion con ese id' }, res, 400, 'No existe un estacion con ese id');

            res.status(200).json({
                ok: true,
                estacion: estacionBorrado
            });

        });

    });



// ============================================
//   Agregar RedSocial
// ============================================
app.get('/:id/redsocial/',
    //mdAutenticacion.verificaToken,
    (req, res) => {

        var idEstacion = req.params.id;

        Estacion.find({ _id: idEstacion })
            .populate('redesSociales.redSocial')
            .exec(
                (err, las) => {

                    if (err) return shared.getResponseError(err, res, 500, 'Error cargando Estacion');


                    if (!las || las.length == 0) return shared.getResponseError({ message: 'No existe un estacion con ese id' }, res, 500, 'No existe la Estacion');

                    var idEstacion = las[0]._id;
                    var redesSociales = las[0].redesSociales;

                    res.status(200).json({
                        ok: true,
                        idEstacion: idEstacion,
                        redesSociales: redesSociales
                    });

                });

    });

app.post('/:id/redsocial/',
    //mdAutenticacion.verificaToken,
    (req, res) => {
        var id = req.params.id;
        var body = req.body;

        var estacionRedsocial = new EstacionRedsocial();
        estacionRedsocial.redSocial = body.redSocial;
        estacionRedsocial.usuario = body.usuario;
        estacionRedsocial.password = body.password;


        Estacion.findOneAndUpdate({ "_id": id }, {
                "$push": {
                    "redesSociales": estacionRedsocial
                }
            },
            function(err, estacionGuardado) {
                if (err) return shared.getResponseError(err, res, 500, 'Error al buscar estacion');
                if (!estacionGuardado) return shared.getResponseError({ message: 'No existe un estacion con ese ID' }, res, 400, 'El estacion con el id ' + id + ' no existe');

                res.status(200).json({
                    ok: true,
                    estacion: estacionGuardado
                });
            }
        );

    });

app.delete('/:id/redsocial/:sid',
    //mdAutenticacion.verificaToken,
    (req, res) => {
        var id = req.params.id;
        var sid = req.params.sid;

        Estacion.findOneAndUpdate({ "_id": id }, {
                "$pull": {
                    "redesSociales": { "_id": sid }
                }
            },
            function(err, estacionGuardado) {
                if (err) return shared.getResponseError(err, res, 500, 'Error al buscar estacion');
                if (!estacionGuardado) return shared.getResponseError({ message: 'No existe un estacion con ese ID' }, res, 400, 'El estacion con el id ' + id + ' no existe');

                res.status(200).json({
                    ok: true,
                    estacion: estacionGuardado
                });
            }
        );
    });

module.exports = app;