function getResponseError(err, res, codigo, mensaje) {

    return res.status(codigo).json({
        ok: false,
        mensaje: mensaje,
        errors: err
    });
}