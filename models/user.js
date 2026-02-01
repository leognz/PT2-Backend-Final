// Este modelo define la estructura de un usuario en la base de datos MongoDB.
// Incluye campos para nombre, apellidos, email y contraseña.

// models/user.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);
