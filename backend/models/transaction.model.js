const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  factureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Facture', required: true },
  montant: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  methodeDePaiement: { type: String, required: true },
  statut: { type: String, default: 'effectué' }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
