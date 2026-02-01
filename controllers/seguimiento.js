const Seguimiento = require('../models/seguimiento');
const Unidad = require('../models/unidad');

/**
 * POST /api/seguimiento
 * Guarda un nuevo punto de seguimiento enviado por una unidad
 */
const registrarSeguimiento = async (req, res) => {
    try {
        const { idUnidad, ubicacion } = req.body;

        // Validamos que la unidad exista
        const unidad = await Unidad.findById(idUnidad);
        if (!unidad) {
            return res.status(404).json({ msg: 'Unidad no encontrada' });
        }

        const nuevoSeguimiento = new Seguimiento({
            idUnidad,
            ubicacion,
            fecha: new Date()
        });

        await nuevoSeguimiento.save();

        res.status(201).json({ msg: 'Seguimiento registrado correctamente' });
    } catch (error) {
        console.error('Error al registrar seguimiento:', error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

/**
 * GET /api/seguimiento/:idUnidad
 * Devuelve los puntos de seguimiento de una unidad en el día actual
 */
const obtenerUbicacionesDelDia = async (req, res) => {
    try {
        const { idUnidad } = req.params;

        // Rango de fechas: desde medianoche hasta ahora
        const hoy = new Date();
        const inicioDelDia = new Date(hoy.setHours(0, 0, 0, 0));
        const finDelDia = new Date(); // ahora mismo

        const ubicaciones = await Seguimiento.find({
            idUnidad,
            fecha: { $gte: inicioDelDia, $lte: finDelDia }
        }).sort({ fecha: 1 });

        res.json(ubicaciones);
    } catch (error) {
        console.error('Error al obtener ubicaciones:', error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

module.exports = {
    registrarSeguimiento,
    obtenerUbicacionesDelDia
};
