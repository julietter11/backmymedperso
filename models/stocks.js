const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
  medicament: { type: mongoose.Schema.Types.ObjectId, ref: 'medicaments' },
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'pharmacies' },
  quantity: Number
});

const Stock = mongoose.model('stocks', stockSchema);

module.exports = Stock;