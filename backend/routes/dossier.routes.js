const express = require('express');
const router = express.Router();
const Dossier = require('../models/dossier.model');

// ➕ Ajouter un dossier
router.post('/', async (req, res) => {
  try {
    const existingDossier = await Dossier.findOne({ numero_affaire: req.body.numero_affaire });

    if (existingDossier) {
      return res.status(400).json({ message: "Ce numéro d'affaire existe déjà. Veuillez en choisir un autre." });
    }

    const newDossier = new Dossier(req.body);
    const saved = await newDossier.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "❌ Ce numéro d'affaire existe déjà. Veuillez en choisir un autre." });
    }
    console.error('Erreur lors de l’ajout du dossier:', error);
    res.status(400).json({ message: "Erreur lors de l’ajout", error });
  }
});

// Récupérer les dossiers d’un client
router.get('/client/:clientId', async (req, res) => {
  try {
    const dossiers = await Dossier.find({ client_id: req.params.clientId });
    res.json(dossiers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 📋 Liste des dossiers
// Exemple dans Node.js + Mongoose
router.get('/', async (req, res) => {
  try {
    const dossiers = await Dossier.find().populate('client_id', ' nom cin').populate('tribunal_id');; // Important
    res.json(dossiers);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement des dossiers' });
  }
});
// 📄 Récupérer un seul dossier par ID
router.get('/:id', async (req, res) => {
  try {
    const dossier = await Dossier.findById(req.params.id).populate('client_id');
    Dossier.findOne().populate('client_id');
    console.log('Dossier:', dossier);

    if (!dossier) {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }
    res.json(dossier);
  } catch (error) {
    console.error('Erreur lors du chargement du dossier:', error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
});


// 📝 Modifier un dossier
router.put('/:id', async (req, res) => {
  try {
    const updated = await Dossier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la modification", error });
  }
});
// Route pour récupérer les détails d'un dossier avec les factures du client
router.get('/:id', async (req, res) => {
  try {
    // Récupérer le dossier avec le client et le tribunal peuplé
    const dossier = await Dossier.findById(req.params.id)
      .populate('client_id') // Peupler les informations du client
      .populate('tribunal_id'); // Peupler les informations du tribunal

    if (!dossier) {
      return res.status(404).json({ message: "Dossier non trouvé" });
    }

    // Récupérer les factures associées au client de ce dossier
    const Facture = require('../models/facture.model');
    const factures = await Facture.find({ client_id: dossier.client_id._id });

    res.status(200).json({ dossier, factures });
  } catch (error) {
    console.error("Erreur récupération du dossier :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// ❌ Supprimer un dossier
router.delete('/:id', async (req, res) => {
  try {
    await Dossier.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Dossier supprimé avec succès" });
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la suppression", error });
  }
});
// Route pour obtenir les détails d'un dossier par ID
router.get('/api/dossiers/:dossierId', async (req, res) => {
  try {
    const dossier = await Dossier.findById(req.params.dossierId).populate('documents');
    if (!dossier) {
      return res.status(404).json({ message: "Dossier non trouvé" });
    }
    res.json(dossier);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
});
// Récupérer les documents d'un dossier
router.get('/api/documents/dossier/:dossierId', async (req, res) => {
  try {
    const documents = await Document.find({ dossier_id: req.params.dossierId });
    res.status(200).json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});
// ✅ Vérification de l'existence du numéro d'affaire
router.get('/check-numero/:numero', async (req, res) => {
  try {
    const exists = await Dossier.exists({ numero_affaire: req.params.numero });
    res.status(200).json(!!exists); // Renvoie true ou false
  } catch (error) {
    console.error("Erreur lors de la vérification du numéro d'affaire:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


module.exports = router;
