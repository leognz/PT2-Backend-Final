/*const clientes = [];
const ubicaciones = {}; // { unidadId: { lat, lng } }

function registrarCliente(res) {
    clientes.push(res);
}

function eliminarCliente(res) {
    const i = clientes.indexOf(res);
    if (i !== -1) clientes.splice(i, 1);
}

function enviarEvento(data) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    clientes.forEach(res => res.write(payload));
}

function actualizarUbicacion(idUnidad, ubicacion) {
    ubicaciones[idUnidad] = ubicacion;

    enviarEvento({
        tipo: 'unidad',
        idUnidad,
        ubicacion,
        activa: true,
    });
}

module.exports = {
    registrarCliente,
    eliminarCliente,
    enviarEvento,
    actualizarUbicacion,
    ubicaciones,
};
*/

const clientes = [];
const ubicaciones = {};

function registrarCliente(res) {
    clientes.push(res);
    console.log('📡 Cliente registrado. Total:', clientes.length);
}

function eliminarCliente(res) {
    const i = clientes.indexOf(res);
    if (i !== -1) {
        clientes.splice(i, 1);
        console.log('❌ Cliente desconectado');
    }
}

function enviarEvento(data) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    console.log('🚀 Enviando evento:', payload);

    clientes.forEach(res => res.write(payload));
}

function actualizarUbicacion(idUnidad, ubicacion) {
    ubicaciones[idUnidad] = ubicacion;
    enviarEvento({
        tipo: 'unidad',
        idUnidad,
        ubicacion,
        activa: true,
    });
}

module.exports = {
    registrarCliente,
    eliminarCliente,
    enviarEvento,
    actualizarUbicacion,
    ubicaciones,
};
