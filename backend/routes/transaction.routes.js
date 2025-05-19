const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction.model');

// Ajouter une transaction
router.post('/pay', (req, res) => {
  const newTransaction = new Transaction({
    factureId: req.body.factureId,
    montant: req.body.montant,
    methodeDePaiement: req.body.methodeDePaiement
  });

  newTransaction.save()
    .then(transaction => {
      // Mettre à jour la facture pour marquer comme "payée"
      Facture.findByIdAndUpdate(req.body.factureId, { statut: 'payé' }, { new: true })
        .then(() => res.status(200).json(transaction))
        .catch(err => res.status(500).json({ error: err.message }));
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
