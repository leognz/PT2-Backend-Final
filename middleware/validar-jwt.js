// middleware/validar-jwt.js
const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({ msg: 'No hay token en la petición' });
    }

    try {
        console.log(process.env.JWT_SECRET);
        console.log('Validando token:', token);
        console.log(jwt.verify(token, process.env.JWT_SECRET))
        const { uid, nombre } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        req.nombre = nombre;
        next();
    } catch (error) {
        console.error('Error al validar el token:');
        console.error(error);
        return res.status(401).json({ msg: 'Token no válido' });
    }
};

module.exports = validarJWT;

