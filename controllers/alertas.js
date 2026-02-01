const Alerta = require('../models/alerta');

// Estructura temporal para agrupar datos por unidad
const alertasPendientes = {};

// Controlador para crear una nueva alerta agrupando datos durante 10 segundos
const crearAlerta = async (req, res) => {
    try {
        const { idUnidad, ubicacion } = req.body;
        const imagenes = req.files?.map(file => `/uploads/${file.filename}`) || [];
        const ahora = new Date();

        // Crea la alerta inmediatamente con los datos recibidos
        const alerta = new Alerta({
            idUnidad,
            img: imagenes,
            ubicacion,
            fecha: ahora
        });
        await alerta.save();

        // Enviar alerta a clientes conectados vía SSE (si usas SSE)
        if (typeof clientesSSE !== 'undefined') {
            const usuarios = Object.keys(clientesSSE);
            usuarios.forEach(uid => {
                clientesSSE[uid].forEach(client => {
                    client.write(`data: ${JSON.stringify(alerta)}\n\n`);
                });
            });
        }

        res.status(201).json({ msg: 'Alerta creada exitosamente.', alerta });
    } catch (error) {
        res.status(500).json({ msg: 'Error al guardar la alerta', error });
    }
};

// Controlador para obtener alertas asociadas a un usuario
const obtenerAlertasPorUsuario = async (req, res) => {
    try {
        const { uid } = req;
        const alertas = await Alerta.find()
            .populate({ path: 'idUnidad', match: { admin: uid } });

        const filtradas = alertas.filter(a => a.idUnidad !== null);
        // Al responder, se incluyen todas las imágenes y la fecha de creación
        res.json(filtradas.map(alerta => ({
            ...alerta.toObject(),
            img: alerta.img,
            fecha: alerta.fecha
        })));
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener alertas', error });
    }
};


// Controlador para obtener una alerta por su ID
const obtenerAlertaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const alerta = await Alerta.findById(id).populate('idUnidad');
        if (!alerta) return res.status(404).json({ msg: 'Alerta no encontrada' });
        res.json({
            ...alerta.toObject(),
            img: alerta.img,
            fecha: alerta.fecha
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener la alerta', error });
    }
};

const clientesSSE = {};
// SSE: mantener la conexión abierta y enviar datos cuando haya nuevas alertas
const sseAlertas = (req, res) => {
    const { id } = req.params;

    // Configurar headers SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Agregar el cliente a la lista
    if (!clientesSSE[id]) clientesSSE[id] = [];
    clientesSSE[id].push(res);

    console.log(`Cliente conectado a SSE (usuario: ${id}). Total: ${clientesSSE[id].length}`);

    // Manejar desconexión
    req.on('close', () => {
        clientesSSE[id] = clientesSSE[id].filter(client => client !== res);
        console.log(`Cliente SSE desconectado (usuario: ${id}). Restantes: ${clientesSSE[id].length}`);
    });
};


module.exports = {
    crearAlerta,
    obtenerAlertasPorUsuario,
    obtenerAlertaPorId,
    sseAlertas,
};