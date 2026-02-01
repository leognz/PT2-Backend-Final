const express = require('express');
const router = express.Router();
const validarJWT = require('../middleware/validar-jwt');
const {
    crearUnidad,
    obtenerUnidadesPorUsuario,
    obtenerUnidadPorId,
    actualizarUnidad,
    eliminarUnidad,
} = require('../controllers/unidades');


const { actualizarUbicacionUnidad } = require('../controllers/unidades');

// esta ruta puede ir SIN validarJWT si es para Raspberry Pi
router.post('/ubicacion', actualizarUbicacionUnidad);


// Todas las rutas usan validarJWT para autenticación
router.use(validarJWT);

/*Solicitud POST la cual recibe los datos para el registro de la unidad y guarda 
los datos en la base de datos.*/
router.post('/', crearUnidad);
/*
Solicitud POST la cual devuelve todas las unidades asociadas al usuario que 
realiza la petición.  
*/
router.post('/obtener', obtenerUnidadesPorUsuario);
/*
Solicitud GET la cual devuelve una unidad registrada especificada por el ID 
que contiene el URL. La unidad debe estar registrada por el usuario que realizo la consulta.
*/ 
router.get('/:id', obtenerUnidadPorId);
/*  
Solicitud PUT la cual recibe los datos para la modificación de una unidad especificada 
por el ID del URL y actualiza la base de datos con los datos recibidos. 
*/
router.put('/:id', actualizarUnidad);
/*
Solicitud DELETE la cual a través del ID especificado en el URL se borra la unidad de la
base de datos. 
*/
router.delete('/:id', eliminarUnidad);


module.exports = router;
