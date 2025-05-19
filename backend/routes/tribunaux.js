// routes/tribunaux.js
const express = require('express');
const router = express.Router();
const TribunalController = require('../controllers/TribunalController');

// Routes CRUD
router.post('/', TribunalController.createTribunal);
router.get('/', TribunalController.getAllTribunaux);
router.get('/:id', TribunalController.getTribunalById);
router.put('/:id', TribunalController.updateTribunal);
router.delete('/:id', TribunalController.deleteTribunal);

module.exports = router;
