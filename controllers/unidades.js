const Unidad = require('../models/unidad');

const crearUnidad = async (req, res) => {
    try {
        const { nombre, apellidos, noUnidad, ruta, noTel } = req.body;
        const admin = req.uid; // El middleware validarJWT debe establecer req.uid

        const nuevaUnidad = new Unidad({ nombre, apellidos, noUnidad, ruta, noTel, admin });
        await nuevaUnidad.save();

        res.status(201).json({ unidad: nuevaUnidad });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear la unidad', error });
    }
};

const obtenerUnidadesPorUsuario = async (req, res) => {
    try {
        const admin = req.uid;
        const unidades = await Unidad.find({ admin });
        res.json({ unidades });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener unidades', error });
    }
};

const obtenerUnidadPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = req.uid;
        const unidad = await Unidad.findOne({ _id: id, admin });

        if (!unidad) {
            return res.status(404).json({ msg: 'Unidad no encontrada' });
        }

        res.json({ unidad });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener la unidad', error });
    }
};

const actualizarUnidad = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = req.uid;
        const datos = req.body;

        let unidad = await Unidad.findOne({ _id: id, admin });
        if (!unidad) {
            return res.status(404).json({ msg: 'Unidad no encontrada' });
        }

        unidad = await Unidad.findByIdAndUpdate(id, datos, { new: true });
        res.json({ unidad });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar la unidad', error });
    }
};

const eliminarUnidad = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = req.uid;

        const unidad = await Unidad.findOneAndDelete({ _id: id, admin });
        if (!unidad) {
            return res.status(404).json({ msg: 'Unidad no encontrada' });
        }

        res.json({ msg: 'Unidad eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar la unidad', error });
    }
};

const { actualizarUbicacion } = require('../utils/sse');

const actualizarUbicacionUnidad = async (req, res) => {
    try {
        const { idUnidad, ubicacion } = req.body;

        if (!idUnidad || !ubicacion) {
            return res.status(400).json({ msg: 'Faltan datos' });
        }

        // Emitir a SSE
        actualizarUbicacion(idUnidad, ubicacion);

        res.status(200).json({ msg: 'Ubicación actualizada y emitida correctamente' });
    } catch (error) {
        console.error('Error al actualizar ubicación:', error);
        res.status(500).json({ msg: 'Error interno' });
    }
};


module.exports = {
    crearUnidad,
    obtenerUnidadesPorUsuario,
    obtenerUnidadPorId,
    actualizarUnidad,
    eliminarUnidad,
    actualizarUbicacionUnidad,
};
