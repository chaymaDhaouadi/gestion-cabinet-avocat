const express = require('express');
const router = express.Router();
const Audience = require('../models/audience');

// ➕ Ajouter une audience
router.post('/', async (req, res) => {
    console.log("🚀 Reçu:", req.body);
    try {
      const newAudience = new Audience(req.body);
      const savedAudience = await newAudience.save();
      res.status(201).json(savedAudience);
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error); // Log de l'erreur
      res.status(400).json({ error: error.message });
    }
  });
  

// 📥 Récupérer toutes les audiences avec les infos du dossier
router.get('/', async (req, res) => {
  try {
    const audiences = await Audience.find().populate('dossier_id');
    res.status(200).json(audiences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
