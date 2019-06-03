const mongoose = require('mongoose');

//Conexión con la BD de Mongo
mongoose.connect("mongodb://localhost:27017/AgenciaViajes", { useCreateIndex: true, useNewUrlParser: true }).then(() => {
    console.log("Conexión a la base de datos correcta");
}).catch((error) => {
    console.log(`Error al conectar con la base de datos: ${error}`);
});

module.exports = mongoose;