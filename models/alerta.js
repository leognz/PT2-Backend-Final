// Importa Schema y model desde mongoose para definir el modelo
const { Schema, model } = require('mongoose');

// Define el esquema de la colección "Alerta"
const AlertaSchema = new Schema({
    // Referencia a la unidad que genera la alerta (relación con el modelo Unidad)
    idUnidad: {
        type: Schema.Types.ObjectId, // Es un ObjectId de MongoDB
        ref: 'Unidad',               // Hace referencia al modelo 'Unidad'
        required: true               // Es obligatorio
    },
    // Arreglo de imágenes asociadas a la alerta (pueden ser rutas locales o URLs)
    img: [{
           data: Buffer,           // Datos binarios de la imagen
           mimetype: String,       // Tipo MIME (image/png, image/jpeg, etc.)
           nombre: String          // Nombre original del archivo
    }],
    // Ubicación geográfica de la alerta
    ubicacion: {
        lat: { type: Number, required: true }, // Latitud (obligatoria)
        lng: { type: Number, required: true }  // Longitud (obligatoria)
    },
    // Fecha en que se creó la alerta
    fecha: {
        type: Date,             // Tipo fecha
        default: Date.now       // Por defecto, la fecha actual
    }
});

// Exporta el modelo 'Alerta' para usarlo en otras partes de la aplicación
module.exports = model('Alerta', AlertaSchema);