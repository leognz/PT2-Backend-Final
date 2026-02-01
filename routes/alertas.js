// Importa Router de Express para crear rutas
const { Router } = require('express');
// Importa los controladores de alertas
const { crearAlerta, obtenerAlertasPorUsuario, obtenerAlertaPorId } = require('../controllers/alertas');
// Importa el middleware para validar JWT (autenticación)
const validarJWT = require('../middleware/validar-jwt');
// Importa multer para manejo de archivos (imágenes)
const multer = require('multer');

// Configuración de almacenamiento para imágenes con multer
// Usar memory storage para procesar imágenes en memoria y guardarlas en MongoDB
const upload = multer({ storage: multer.memoryStorage() });

// Crea el router de Express
const router = Router();

const { sseAlertas } = require('../controllers/alertas'); // Importa el controlador para SSE

// Ruta para enviar alertas en tiempo real a través de SSE
// GET /api/alertas/sse/:idUsuario
router.get('/sse/:id', sseAlertas);
// Ruta para crear una alerta (permite subir varias imágenes)
// POST /api/alertas
/*
Solicitud POST la cual recibe los datos por parte de la unidad de procesamiento para crear
la alerta y que se almacene la información.
*/
router.post('/', upload.array('imagenes'), crearAlerta);

// Ruta para obtener alertas asociadas a un usuario (requiere JWT)
// POST /api/alertas/obtener

router.post('/obtener', validarJWT, obtenerAlertasPorUsuario);

// Ruta para obtener una alerta por su ID
// GET /api/alertas/:id
router.get('/:id', obtenerAlertaPorId);



// Exporta el router para usarlo en la app principal
module.exports = router;