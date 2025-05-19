// models/Tribunal.js
const mongoose = require('mongoose');

const TribunalSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  categorie: { 
    type: String, 
    required: true, 
    enum: ['محاكم قضائية', 'المحاكم الابتدائية', 'محاكم الاستئناف']

  },
  adresse: { type: String, required: true },
  contact: {
    telephone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{8}$/.test(v); // Vérifie que le numéro contient exactement 8 chiffres
        },
        message: "Le numéro de téléphone doit être composé de 8 chiffres (Tunisie)."
      }
    },
    email: { type: String, required: true }
  }
});
module.exports = mongoose.model('Tribunal', TribunalSchema);
