const express = require('express');
const cors = require('cors');
const path = require('path');
const { API_VERSION } = require("./constants");

const app = express();

// Middleware para parsear JSON y URL-encoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Habilitar CORS
app.use(cors());

// Servir archivos estáticos de la carpeta uploads
//app.use(express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // <--- reemplaza aquí

// Importar rutas
const authRoutes = require('./routes/auth');
const unidadesRoutes = require('./routes/unidades');
const alertasRoutes = require('./routes/alertas');
const seguimientoRoutes = require('./routes/seguimiento');
//const sseRoutes = require('./routes/sse'); // Importar rutas SSE


// Montar rutas
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}/unidades`, unidadesRoutes);
app.use(`/api/${API_VERSION}/alertas`, alertasRoutes);
app.use(`/api/${API_VERSION}/seguimiento`, seguimientoRoutes);
//app.use(`/api/${API_VERSION}/sse`, sseRoutes); // Montar rutas SSE

// Exportar la app
module.exports = app;
