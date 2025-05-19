const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');

// ➕ Ajouter un client
router.post('/', clientController.addClient);

// 📋 Lister tous les clients
router.get('/', clientController.getClients);

// 🔍 Obtenir un client par ID
router.get('/:id', clientController.getClientById);

// ✏️ Modifier un client
router.put('/:id', clientController.updateClient);

// 🗑 Supprimer un client
router.delete('/:id', clientController.deleteClient);

router.get('/cin/:cin', clientController.getClientByCIN);

  // Vérification de l'unicité du CIN
router.get('/cin/:cin', clientController.checkCIN);

module.exports = router;
