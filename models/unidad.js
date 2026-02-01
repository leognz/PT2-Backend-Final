// Este modelo define la estructura de una unidad en la base de datos MongoDB.
// Incluye campos para nombre, apellidos, número de unidad, ruta, número de teléfono
//  y una referencia al administrador (Usuario).

// Importa mongoose para definir el esquema y el modelo
const mongoose = require('mongoose');

// Define el esquema de la colección "Unidad"
const UnidadSchema = new mongoose.Schema({
    nombre: {
        type: String,           // El nombre de la unidad
        required: true          // Es obligatorio
    },
    apellidos: {
        type: String,           // Apellidos del responsable o unidad
        required: true          // Es obligatorio
    },
    noUnidad: {
        type: String,           // Número identificador de la unidad
        required: true          // Es obligatorio
    },
    ruta: {
        type: String,           // Ruta asignada a la unidad
        required: true          // Es obligatorio
    },
    noTel: {
        type: String,           // Número de teléfono de contacto
        required: true          // Es obligatorio
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId, // Referencia a un usuario administrador
        ref: 'User',                         // Relación con el modelo 'User'
        required: true                       // Es obligatorio
    }
}, {
    timestamps: true // Agrega automáticamente campos createdAt y updatedAt
});

// Exporta el modelo 'Unidad' para usarlo en otras partes de la aplicación
module.exports = mongoose.model('Unidad', UnidadSchema);
