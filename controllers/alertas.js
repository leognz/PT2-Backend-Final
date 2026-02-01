const Alerta = require('../models/alerta');

// Estructura temporal para agrupar datos por unidad
const alertasPendientes = {};

// Clientes SSE (declarado arriba para evitar TDZ)
const clientesSSE = {};

// Controlador para crear una nueva alerta agrupando datos durante 10 segundos
const crearAlerta = async (req, res) => {
    try {
        const { idUnidad, ubicacion } = req.body;
        // Convertir ubicación string a objeto si es necesario
        let ubicacionObj = ubicacion;
        if (typeof ubicacion === 'string') {
            ubicacionObj = JSON.parse(ubicacion);
        }

        // Procesar imágenes: guardar como Buffer en MongoDB
        const imagenes = req.files?.map(file => ({
            data: file.buffer,
            mimetype: file.mimetype,
            nombre: file.originalname
        })) || [];

        const ahora = new Date();

        // Crea la alerta inmediatamente con los datos recibidos
        const alerta = new Alerta({
            idUnidad,
            img: imagenes,
            ubicacion: ubicacionObj,
            fecha: ahora
        });
        await alerta.save();

        // Enviar alerta a clientes conectados vía SSE (si hay conexiones)
        const usuarios = Object.keys(clientesSSE);
        usuarios.forEach(uid => {
            clientesSSE[uid].forEach(client => {
                client.write(`data: ${JSON.stringify(alerta)}\n\n`);
            });
        });

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

        // Mapear y convertir imágenes a base64
        const resultado = filtradas.map(alerta => {
            const alertaObj = alerta.toObject();
            alertaObj.img = (alerta.img || []).map(img => {
                try {
                    // Convertir Buffer a base64
                    let base64Data = '';
                    if (img.data && img.data.type === 'Buffer' && img.data.data) {
                        // Formato serializado de Mongoose
                        base64Data = Buffer.from(img.data.data).toString('base64');
                    } else if (img.data instanceof Buffer) {
                        // Buffer directo
                        base64Data = img.data.toString('base64');
                    } else if (typeof img.data === 'string') {
                        // Ya es string (fallback)
                        base64Data = img.data;
                    }

                    return {
                        data: `data:${img.mimetype || 'image/jpeg'};base64,${base64Data}`,
                        nombre: img.nombre
                    };
                } catch (err) {
                    console.error('Error al convertir imagen a base64:', err);
                    return { data: '', nombre: img.nombre };
                }
            });
            return alertaObj;
        });

        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener alertas:', error);
        res.status(500).json({ msg: 'Error al obtener alertas', error: error.message });
    }
};


// Controlador para obtener una alerta por su ID
const obtenerAlertaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const alerta = await Alerta.findById(id).populate('idUnidad');
        if (!alerta) return res.status(404).json({ msg: 'Alerta no encontrada' });
        
        const alertaObj = alerta.toObject();
        // Convertir imágenes Buffer a Base64 para enviar al frontend
        alertaObj.img = (alerta.img || []).map(img => {
            try {
                let base64Data = '';
                if (img.data && img.data.type === 'Buffer' && img.data.data) {
                    base64Data = Buffer.from(img.data.data).toString('base64');
                } else if (img.data instanceof Buffer) {
                    base64Data = img.data.toString('base64');
                } else if (typeof img.data === 'string') {
                    base64Data = img.data;
                }

                return {
                    data: `data:${img.mimetype || 'image/jpeg'};base64,${base64Data}`,
                    nombre: img.nombre
                };
            } catch (err) {
                console.error('Error al convertir imagen a base64:', err);
                return { data: '', nombre: img.nombre };
            }
        });
        
        res.json(alertaObj);
    } catch (error) {
        console.error('Error al obtener la alerta:', error);
        res.status(500).json({ msg: 'Error al obtener la alerta', error: error.message });
    }
};

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