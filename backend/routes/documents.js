const express = require('express');
const multer = require('multer');
const path = require('path');

const Document = require('../models/document');  // Assure-toi que tu importes le modèle correctement
const Dossier = require('../models/dossier.model');  // Importer le modèle du dossier

const router = express.Router();

// Configuration de multer pour le téléchargement des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Le dossier où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Nom unique pour éviter les conflits
  }
});

const upload = multer({ storage });

// Route pour ajouter un document
// routes/documents.routes.js
router.post('/', upload.single('file'), async (req, res) => {
  try {
    console.log('REQ BODY:', req.body);
    console.log('REQ FILE:', req.file);

    const document = new Document({
      nom_fichier: req.body.nom_fichier,
      type: req.body.type,
      fichier_url: req.file ? req.file.path : '',
      date_creation: new Date(),
      dossier_id: req.body.dossier_id,  // ✅ Utilise req.body.dossier_id directement
      facture_id: req.body.facture_id  // ✅ Utilise req.body.facture_id directement
    });

    const savedDocument = await document.save();

    res.status(201).json({ message: 'Document ajouté avec succès', document: savedDocument });
  } catch (err) {
    console.error('Erreur serveur :', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});



// 📄 Lister tous les documents
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find()
      .populate({
        path: 'dossier_id', // ✅ Utilise le bon nom du champ
        select: 'titre_dossier' // Sélectionne uniquement le champ désiré
      })
      .populate('facture_id', 'montant numeroFacture');

    console.log('Documents:', documents);
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// 📄 Récupérer un document par son ID
// 📄 Récupérer un document par son ID avec dossier et client
// 📄 Récupérer un document par son ID avec dossier et client
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
  .populate({
    path: 'dossier_id',
    populate: { path: 'client_id', select: 'nom cin' }
  })
  .populate('facture_id', 'montant numeroFacture nom');


  
    if (!document) {
      return res.status(404).json({ message: 'Document non trouvé' });
    }

    res.json(document);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});
router.put('/:id', upload.single('file'), async (req, res) => {
  try {
    const updateData = {
      nom_fichier: req.body.nom_fichier,
      type: req.body.type,
      dossier_id: req.body.dossier_id,
      facture_id: req.body.facture_id
    };

    if (req.file) {
      updateData.fichier_url = req.file.path;
    }

    const updated = await Document.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour', details: err.message });
  }
});
// 📄 Lister tous les documents avec population correcte
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find()
      .populate({
        path: 'dossier_id', // ✅ Assure-toi que ce champ est correct
        select: 'titre_dossier' 
      })
      .populate('facture_id', 'montant numeroFacture');

    console.log('Documents:', documents);
    res.json(documents);
  } catch (err) {
    console.error('Erreur serveur :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// routes/documents.routes.js
router.get('/dossier/:dossierId', async (req, res) => {
  try {
    const documents = await Document.find({ dossier_id: req.params.dossierId }) // ✅ dossier_id et pas dossier
      .populate({
        path: 'dossier_id',
        select: 'titre_dossier'
      });

    res.status(200).json(documents);
  } catch (error) {
    console.error('Erreur serveur :', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// DELETE /api/documents/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Supprimer le document
    const deletedDoc = await Document.findByIdAndDelete(id);

    // Enlever le document de la liste du dossier
    if (deletedDoc) {
      await Dossier.findByIdAndUpdate(
        deletedDoc.dossier_id,
        { $pull: { documents: deletedDoc._id } }
      );
    }

    res.status(200).json({ message: 'Document supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du document:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});



module.exports = router;
