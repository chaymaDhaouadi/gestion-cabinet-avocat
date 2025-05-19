// controllers/TribunalController.js
const Tribunal = require('../models/Tribunal');

// Ajouter un tribunal
exports.createTribunal = async (req, res) => {
  try {
    const { nom, categorie, adresse, contact } = req.body;

    if (!nom || !categorie || !adresse || !contact) {
      return res.status(400).json({ message: 'Toutes les informations sont requises.' });
    }

    const newTribunal = new Tribunal({ nom, categorie, adresse, contact });
    await newTribunal.save();
    res.status(201).json({ message: 'Tribunal ajouté avec succès.' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  }
};

// Lister tous les tribunaux
exports.getAllTribunaux = async (req, res) => {
  try {
    const tribunaux = await Tribunal.find();
    res.status(200).json(tribunaux);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un tribunal par ID
exports.getTribunalById = async (req, res) => {
  try {
    const tribunal = await Tribunal.findById(req.params.id);
    if (!tribunal) return res.status(404).json({ message: "Tribunal introuvable" });
    res.status(200).json(tribunal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un tribunal
exports.updateTribunal = async (req, res) => {
  try {
    const tribunal = await Tribunal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tribunal) return res.status(404).json({ message: "Tribunal introuvable" });
    res.status(200).json(tribunal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un tribunal
exports.deleteTribunal = async (req, res) => {
  try {
    const tribunal = await Tribunal.findByIdAndDelete(req.params.id);
    if (!tribunal) return res.status(404).json({ message: "Tribunal introuvable" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
