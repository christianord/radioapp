var express = require('express');
var mongoose = require('mongoose');
var bodyParses = require('body-parser');

var app = express();

app.use(bodyParses.urlencoded({ extended: false }));
app.use(bodyParses.json());

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var connection_string = 'localhost:27017/apiRadioDB';

// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_HOST) {
    connection_string = process.env.MONGODB_USER + ":" +
        process.env.MONGODB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.MONGODB_DATABASE;
}

mongoose.connection.openUri('mongodb://' + connection_string, (err, res) => {
    if (err) throw err;
    console.log("mongodb online localhost port 27017");
});


//Importar Rutas
var appRoutes = require('./routes/app.js');
var usuarioRoutes = require('./routes/usuario.js');
//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);

app.listen(server_port, server_ip_address, function() {
    console.log("Listening on " + server_ip_address + ", port " + server_port);
});