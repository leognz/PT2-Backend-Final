const express = require('express');
const router = express.Router();
const {
    registrarUsuario,
    loginUsuario,
    revalidarToken
} = require('../controllers/auth');
const validarJWT = require('../middleware/validar-jwt');

// Registro de usuario
router.post('/usuarios', registrarUsuario);

// Login
router.post('/login', loginUsuario);

// Renovar token (requiere JWT válido)
router.get('/renew', validarJWT, revalidarToken);

module.exports = router;
