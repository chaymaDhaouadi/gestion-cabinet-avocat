// models/rendezvous.model.js

const mongoose = require('mongoose');

const RendezVousSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    date: { type: Date, required: true },
    heure: { type: String, required: true },
        dateHeure: { type: Date, required: true }, // ✅ Champ combiné date + heure

    lieu: { type: String },
    notes: { type: String },
    statut: { type: String, default: 'prévu' },
    clientId: {  // ✅ Uniformise le champ clientId (camelCase)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    }
}, {
    timestamps: true  // ✅ Pour avoir createdAt et updatedAt automatiquement
});

module.exports = mongoose.model('RendezVous', RendezVousSchema);
