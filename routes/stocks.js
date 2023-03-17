var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const Stock = require('../models/stocks');
const Pharmacy = require('../models/pharmacies');
const Medicament = require('../models/medicaments');
const { generateStock } = require('../modules/generateStock');

/*générer un stock aléatoire
router.get('/generate-stock', async (req, res) => {
  try {
    await generateStock();
    res.send('Stock généré avec succès !');
  } catch (error) {
    console.error('Erreur lors de la génération de stock :', error);
    res.status(500).send('Une erreur est survenue lors de la génération de stock.');
  }
});*/

//ajout stock dans une pharmacie
router.post('/:pharmacyId/:medicamentId/:quantity', async (req, res) => {
    const { pharmacyId, medicamentId, quantity } = req.params;

    const pharmacy = await Pharmacy.findById(pharmacyId);
    const medicament = await Medicament.findById(medicamentId);

    if (!pharmacy || !medicament){
        res.json({ result: false, error: 'Medicament ou Pharmacie introuvable' });
        return;
    };

    const filter = { pharmacy: pharmacyId, medicament: medicamentId };
    const update = { quantity: quantity };
    const options = { upsert: true, new: true };
    const result = await Stock.findOneAndUpdate(filter, update, options);

    res.json({result: true, message: 'stock mis à jour'});
})

//trouver pharmacie stock supérieur à 0 d'un médicament donné
router.get('/:medicamentName', async (req, res) => {
    //const { medicamentName } = req.params;

    const medicament = await Medicament.findOne({ Nom: req.params.medicamentName });

    console.log(medicament);

    if (!medicament) {
      return res.json({ message: 'Le médicament demandé n\'existe pas.' });
    }

      const stocks = await Stock.find({ medicament: medicament._id, quantity: { $gt: 0 } }).populate('pharmacy')
      
        //console.log(data);
        //const pharmacies = data.map(stock => stock.pharmacy);
        res.json({ result: true, stocks });
      
      /*const pharmacies = stocks.map(stock => stock.pharmacy);
      res.json(pharmacies);*/
  });




module.exports = router;