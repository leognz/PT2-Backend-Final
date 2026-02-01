// utils/jwt.js
const jwt = require('jsonwebtoken');

const generarJWT = (uid, nombre) => {
    return new Promise((resolve, reject) => {
        const payload = { uid, nombre };
        let password = process.env.JWT_SECRET;
        console.log("login",password);
        jwt.sign(payload, password , {
            expiresIn: '24h',

        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            }
            resolve(token);
        });
    });
};

module.exports = { generarJWT };
