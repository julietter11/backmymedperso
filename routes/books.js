var express = require('express');
var router = express.Router();

require('../models/connection');
const Medicament = require('../models/medicaments');
const User = require('../models/users');
const Book = require('../models/books');
const Stock = require('../models/stocks');

//reservation medicament
router.post('/:medicamentId/:pharmacyId', async (req, res) => {
  const { medicamentId, pharmacyId } = req.params;
  const { token } = req.body;
  try {
    const user = await User.findOne({token: token})

    const stock = await Stock.findOneAndUpdate(
      { medicament: medicamentId, pharmacy: pharmacyId },
      { $inc: { quantity: -1 } },
      { new: true }
    );
    if (!stock) {
      return res.status(404).json({ result: false, message: "Ce médicament n'est plus en stock" });
    }
    const book = new Book({
      medicament: medicamentId,
      pharmacy: pharmacyId,
      user: user._id,
      expiresAt: Date.now() + 2 * 60 * 60 * 1000 // expire après 2 heures
    });
    await book.save();
    res.json({ result: true, message: 'Réservation créée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Une erreur est survenue lors de la création de la réservation.' });
  }
});

//liste des réservation pour un utilisateur
router.get('/:token', async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({token: token})

    try {
      const reservations = await Book.find({ user: user._id }).populate('medicament').populate('pharmacy');
      const currentTime = new Date().getTime();
      const reservationList = reservations.map(reservation => {
        const timeRemaining = reservation.expiresAt.getTime() - currentTime;
        return {
          medicamentName: reservation.medicament.Nom,
          pharmacyName: reservation.pharmacy.name,
          timeRemaining: Math.ceil(timeRemaining / (1000 * 60)) // convert to minutes and round up
        };
      });
      res.json({result: true, book: reservationList});
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, message: 'Une erreur est survenue lors de la recherche des réservations.' });
    }
  });
  


module.exports = router;