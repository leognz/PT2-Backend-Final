// controladores/auth.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { generarJWT } = require('../utils/jwt');

const registrarUsuario = async (req, res) => {
    const { nombre, apellidos, email, password } = req.body;

    try {
        let usuario = await User.findOne({ email });
        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe con ese correo' });
        }

        usuario = new User({ nombre, apellidos, email, password });

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        const token = await generarJWT(usuario.id, usuario.nombre);

        res.status(201).json({
            uid: usuario.id,
            nombre: usuario.nombre,
            token
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

const loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'Correo no registrado' });
        }

        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        const token = await generarJWT(usuario.id, usuario.nombre);
        let response = {
            uid: usuario.id,
            nombre: usuario.nombre,
            token
        }
        console.log("response LOGIN")
        console.log(JSON.stringify(response),null,3)
        res.json(response);
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

const revalidarToken = async (req, res) => {
    const { uid, nombre } = req;

    const token = await generarJWT(uid, nombre);

    res.json({ uid, nombre, token });
};

module.exports = {
    registrarUsuario,
    loginUsuario,
    revalidarToken
};

