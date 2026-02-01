/*/ Importa Router de Express para crear rutas
const { Router } = require('express');
const { sseAlertas } = require('../controllers/sse'); // Importa el controlador para SSE

// Crea el router de Express

const router = Router();

// Ruta para enviar alertas en tiempo real a través de SSE
// GET /api/alertas/sse/:idUsuario
router.get('/sse/:id', sseAlertas);

// Exporta el router para usarlo en la app principal
module.exports = router;*/