const mongoose = require('mongoose');

const SeguimientoSchema = new mongoose.Schema({
    idUnidad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unidad',
        required: true
    },
    ubicacion: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Seguimiento', SeguimientoSchema);
