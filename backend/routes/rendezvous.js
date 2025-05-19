// routes/rendezvous.routes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const RendezVous = require('../models/rendezvous.model');

// Route d'ajout de rendez-vous
// ✅ Modification de la route POST dans rendezvous.routes.js
// ✅ Route d'ajout de rendez-vous
router.post('/', async (req, res) => {
    try {
        console.log('✅ Données reçues du frontend :', req.body);

        if (!req.body.titre || !req.body.date || !req.body.heure || !req.body.clientId) {
            return res.status(400).json({ error: 'Tous les champs requis doivent être fournis.' });
        }

        const dateRdv = new Date(req.body.date);
        const heureRdv = req.body.heure;
        const dateHeure = new Date(`${req.body.date}T${heureRdv}:00`); // ✅ Date et heure combinées

        console.log('✅ Date et heure combinées :', dateHeure);

        if (isNaN(dateHeure.getTime())) {
            console.error('❌ Date ou heure invalide.');
            return res.status(400).json({ error: 'Date ou heure invalide.' });
        }

        // ✅ Vérification des conflits d'heure (même heure ou à moins de 30 minutes)
        const conflictRdv = await RendezVous.find({
            dateHeure: {
                $gte: new Date(dateHeure.getTime() - 30 * 60 * 1000), // 30 minutes avant
                $lte: new Date(dateHeure.getTime() + 30 * 60 * 1000)  // 30 minutes après
            }
        });

        if (conflictRdv.length > 0) {
            return res.status(400).json({
                error: 'Deux rendez-vous ne peuvent pas être créés à la même heure ou avec moins de 30 minutes de différence.'
            });
        }

        const rdv = new RendezVous({
            titre: req.body.titre,
            date: dateRdv,
            heure: heureRdv,
            dateHeure: dateHeure, // ✅ Enregistrer la date et l'heure combinées
            lieu: req.body.lieu,
            notes: req.body.notes,
            statut: req.body.statut || 'prévu',
            clientId: req.body.clientId
        });

        const savedRdv = await rdv.save();
        console.log('✅ Rendez-vous enregistré dans MongoDB :', savedRdv);

        res.status(201).json(savedRdv);
    } catch (err) {
        console.error('❌ Erreur lors de l\'ajout du rendez-vous :', err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du rendez-vous.' });
    }
});


// 📋 Lister tous les rendez-vous
router.get('/', async (req, res) => {
    try {
        const rendezVous = await RendezVous.find().populate('clientId');
        console.log('✅ Liste des rendez-vous envoyés :', rendezVous);
        res.json(rendezVous);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🔍 Obtenir un rendez-vous par ID
router.get('/:id', async (req, res) => {
    try {
        const rv = await RendezVous.findById(req.params.id).populate('clientId'); // ✅ Correction ici
        if (!rv) return res.status(404).json({ message: 'Rendez-vous non trouvé' });
        res.json(rv);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware pour convertir l'ID en ObjectId valide
// Middleware pour convertir l'ID en ObjectId valide
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  // Vérifie si l'ID est un ObjectId valide
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID invalide.' });
  }

  try {
    const rendezVous = await RendezVous.findByIdAndUpdate(id, req.body, { new: true });
    if (!rendezVous) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé.' });
    }
    res.status(200).json(rendezVous);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification du rendez-vous.' });
  }
});


// ✏️ Modifier un rendez-vous (seule l'heure peut changer)
router.put('/:id', async (req, res) => {
    try {
        const { titre, heure, lieu, notes, statut, clientId } = req.body;
        if (!heure || !lieu || !notes || !statut || !clientId) {
            return res.status(400).json({ error: 'Tous les champs sont requis sauf la date.' });
        }
         // Mise à jour de tous les champs sauf la date
        const rdvModifie = await RendezVous.findByIdAndUpdate(
            req.params.id,
            { 
                titre,
                heure,
                lieu,
                notes,
                statut,
                clientId
            },
            { new: true }
        ).populate('clientId');

        if (!rdvModifie) {
            return res.status(404).json({ message: 'Rendez-vous non trouvé' });
        }

        res.json(rdvModifie);  // On retourne le rendez-vous mis à jour
    } catch (err) {
        console.error('Erreur lors de la modification du rendez-vous :', err);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
})

// ❌ Supprimer un rendez-vous
router.delete('/:id', async (req, res) => {
    try {
        await RendezVous.findByIdAndDelete(req.params.id);
        res.json({ message: 'Rendez-vous supprimé' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
