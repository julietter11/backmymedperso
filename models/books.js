const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    medicament: { type: mongoose.Schema.Types.ObjectId, ref: 'medicaments' },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'pharmacies' },
    quantity: Number,
    reservedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, expires: 7200 }
});

const Book = mongoose.model('books', bookSchema);

module.exports = Book;