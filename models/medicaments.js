const mongoose = require('mongoose');

const medicamentSchema = mongoose.Schema({
  Nom: String,
  Caractéristique: String,
  ordonnance: Boolean,
});

const Medicament = mongoose.model('medicaments', medicamentSchema);

module.exports = Medicament;