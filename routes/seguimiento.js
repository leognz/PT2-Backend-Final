// routes/seguimiento.js
const express = require('express');
const router = express.Router();
const { registrarSeguimiento, obtenerUbicacionesDelDia } = require('../controllers/seguimiento');
const validarJWT = require('../middleware/validar-jwt');

// Registrar seguimiento (usado por Raspberry Pi)
router.post('/', validarJWT ,registrarSeguimiento);

// Obtener ubicaciones del día por unidad (para mostrar en frontend)
router.get('/:idUnidad', obtenerUbicacionesDelDia);

module.exports = router;
