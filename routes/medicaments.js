var express = require('express');
var router = express.Router();

require('../models/connection');
const Medicament = require('../models/medicaments');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');

/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

//ajout nouveau medicament
router.post('/', (req, res) => {
    const { name, description, ordonnance } = req.body;

    Medicament.findOne({ name: name }).then(medicament => {
        if (medicament === null) {
            const newMedicament = new Medicament({
                name,
                description,
                ordonnance
            });
        
            newMedicament.save().then(newDoc => {
              res.json({ result: true, medicament: newDoc });
            });
        } else {
            res.json({ result: false, error: 'Le médicament existe déjà' });
        }
      });
      
})

//liste tous les médicaments présent dans la base de données
router.get('/allMedicaments', async (req, res) => {
    Medicament.find()
    .then(dataAllMed => {
      if (dataAllMed.length > 0) {
        res.json({result: true, medicaments: dataAllMed})
      } else {
        res.json({result: false, error: 'Pas de médicaments trouvés'})
      }
    })
});

//like medicament
router.put('/likeMed/:medicamentName', (req, res) => {
  if (!checkBody(req.body, ['token'])) {
    res.json({ result: false, error: 'Veuillez remplir tous les champs de saisie' });
    return;
  }

  User.findOne({ token: req.body.token }).then(user => {
    if (user === null) {
      res.json({ result: false, error: 'Utilisateur non trouvé' });
      return;
    }

    Medicament.findOne({Nom: req.params.medicamentName}).then(data => {
      if (!data) {
        res.json({ result: false, error: 'Médicament non trouvé' });
        return;
      }

      if (user.likes.includes(req.params.medicamentName)) { // User already liked the Med
        User.updateOne({ _id: user._id }, { $pull: { likes: req.params.medicamentName } }) // Remove user ID from likes
          .then(() => {
            res.json({ result: true });
          });
      } else { // User has not liked the Med
        User.updateOne({ _id: user._id }, { $push: { likes: req.params.medicamentName } }) // Add user ID to likes
          .then(() => {
            res.json({ result: true });
          });
      }
    });
  });
});

module.exports = router;