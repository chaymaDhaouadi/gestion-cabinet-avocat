const express = require('express');
const router = express.Router();
const Facture = require('../models/facture.model');
const Document = require('../models/document'); // modèle pour documents
const multer = require('multer');
const path = require('path');
const Dossier = require('../models/dossier.model');

// Configuration du stockage pour les reçus
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/receipts/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// POST - Créer une facture (sans reçu)
router.post('/create', async (req, res) => {
  try {
    const existingFacture = await Facture.findOne({ numeroFacture: req.body.numeroFacture });
    if (existingFacture) {
      return res.status(400).json({ message: "Le numéro de facture doit être unique." });
    }

    const newFacture = new Facture({
      numeroFacture: req.body.numeroFacture,
      clientId: req.body.clientId,
      dossierId: req.body.dossierId,
      montant: req.body.montant,
      date: req.body.date,
      statut: req.body.statut,
      description: req.body.description
    });

    const savedFacture = await newFacture.save();
    res.status(201).json(savedFacture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET - Récupérer toutes les factures avec client et dossier
router.get('/', async (req, res) => {
  try {
    const factures = await Facture.find()
      .populate({ path: 'clientId', model: 'Client', select: 'nom cin' })
      .populate({ path: 'dossierId', model: 'Dossier', select: 'titre_dossier' });

    res.status(200).json(factures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Ajouter une facture avec un reçu (fichier)
router.post('/', upload.single('receipt'), async (req, res) => {
  try {
    const factureData = {
      numeroFacture: req.body.numeroFacture,
      clientId: req.body.clientId,
      dossierId: req.body.dossierId,
      montant: parseFloat(req.body.montant),
      description: req.body.description,
      date: req.body.date || new Date(),
      statut: req.body.statut
    };

    const facture = new Facture(factureData);
    const savedFacture = await facture.save();

    if (req.file) {
      const document = new Document({
        nom_fichier: req.file.filename,
        type: req.file.mimetype,
        fichier_url: `/uploads/receipts/${req.file.filename}`,
        dossier_id: req.body.dossierId,
        date_creation: new Date()
      });
      await document.save();
    }

    res.status(201).json(savedFacture);
  } catch (error) {
    console.error('Erreur lors de l’ajout :', error);
    res.status(500).json({ error: error.message });
  }
});
// GET - Récupérer les factures par clientId
router.get('/client/:clientId', async (req, res) => {
  try {
    const factures = await Facture.find({ clientId: req.params.clientId })
      .populate({ path: 'clientId', model: 'Client', select: 'nom cin' })
      .populate({ path: 'dossierId', model: 'Dossier', select: 'titre_dossier' });

    if (!factures || factures.length === 0) {
      return res.status(404).json({ message: "Aucune facture trouvée pour ce client." });
    }

    res.status(200).json(factures);
  } catch (error) {
    console.error("Erreur lors de la récupération des factures :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// DELETE - Supprimer une facture par ID
router.delete('/:id', async (req, res) => {
  try {
    const facture = await Facture.findByIdAndDelete(req.params.id);
    if (!facture) {
      return res.status(404).json({ message: "Facture non trouvée" });
    }
    res.status(200).json({ message: "Facture supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
