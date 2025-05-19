const mongoose = require('mongoose');

const dossierSchema = new mongoose.Schema({
  numero_affaire: { type: String, unique: true, required: true },  // ajouté ici
  titre_dossier: { type: String, required: true },
  description: { type: String },
  type_dossier: { type: String },
  date_ouverture: { type: Date, default: Date.now },
  statut: { type: String, enum: ['en cours', 'clos', 'suspendu'], default: 'en cours' },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  tribunal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tribunal' }, // ajouté ici si tu as un modèle Tribunal
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
});


module.exports = mongoose.model('Dossier', dossierSchema);
