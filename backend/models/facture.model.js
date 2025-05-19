const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const factureSchema = new Schema({
  numeroFacture: {
    type: String,
    unique: true,
    required: true,
    match: /^FAC-\d{5}$/, // Regex pour s'assurer que le numéro commence par FAC- et a 5 chiffres
  },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  dossierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dossier', required: true },
  montant: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  statut: { type: String, required: true }
});

// Middleware pour générer automatiquement un numéro de facture si absent
factureSchema.pre('save', async function (next) {
  if (!this.numeroFacture) {
    let lastFacture = await this.constructor.findOne().sort({ _id: -1 }).exec();
    let nextNumber = lastFacture ? parseInt(lastFacture.numeroFacture.slice(4)) + 1 : 1;
    this.numeroFacture = `FAC-${String(nextNumber).padStart(5, '0')}`;
  }
  next();
});

const Facture = mongoose.model('Facture', factureSchema);
module.exports = Facture;
