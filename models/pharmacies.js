const mongoose = require('mongoose');

const pharmacySchema = mongoose.Schema({
  name: String,
  adresse: String,
  city: String,
  tel: Number,
  horaires: Object,
  coordonnées: Object,
  garde: Boolean
});

const Pharmacy = mongoose.model('pharmacies', pharmacySchema);

module.exports = Pharmacy;