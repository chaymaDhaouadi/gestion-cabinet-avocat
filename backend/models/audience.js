const mongoose = require('mongoose');

const audienceSchema = new mongoose.Schema({
    dossier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dossier',
        required: false, // ✅ pas obligatoire
        default: null // ✅ vide autorisé
      },
    date_audience: { type: Date, required: true },
  lieu: { type: String, required: true },
  resume: { type: String, required: true },
  resultat: { type: String }
});

module.exports = mongoose.model('Audience', audienceSchema);
