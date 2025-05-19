// routes/documents.routes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const documentSchema = new mongoose.Schema({
  nom_fichier: { type: String, required: true },
  type: { type: String, required: true },
  fichier_url: { type: String, required: true },
  date_creation: { type: Date, default: Date.now },
  dossier_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Dossier', // ✅ Doit correspondre exactement au nom du modèle Dossier
    required: true 
  },
  facture_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facture' // ✅ Si tu utilises ce modèle, assure-toi qu'il est bien défini.
  }
});

module.exports = mongoose.model('Document', documentSchema);
