const mongoose = require('mongoose');
const app = require('./app');
const { DB_USER, DB_PASSWORD, DB_HOST, IP_SERVER, API_VERSION } = require("./constants");
require('dotenv').config();
// Importar variables de entorno
// Configuración de la base de datos

// Configuración del puerto
const PORT = process.env.PORT || 3977;

// Configuración de la base de datos
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/`)
    .then(() => {
        console.log('Conectado a MongoDB');
        // Iniciar el servidor
        console.log(typeof app); // debería ser "function" si es una app de Express
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`############################`);
            console.log(`# API REST con Node.js y MongoDB #`);
            console.log(`Hola mundo!`);
            console.log(`Hola mundo!`);
            console.log(`############################`);
            console.log(`Servidor corriendo en puerto ${PORT}`);
        });
    })
    .catch(err => console.error('Error al conectar a MongoDB:', err));
