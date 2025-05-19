const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  cin: Number,
  nom: String,
  email: String,
  telephone: String,
  adresse: String
});

module.exports = mongoose.model('Client', clientSchema);
