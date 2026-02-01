const {
    registrarCliente,
    eliminarCliente,
} = require('../utils/sse');

const sseAlertas = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    registrarCliente(res);

    req.on('close', () => {
        eliminarCliente(res);
    });
};

module.exports = {
    sseAlertas,
};
