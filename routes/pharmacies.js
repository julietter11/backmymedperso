var express = require('express');
var router = express.Router();

require('../models/connection');
const Pharmacy = require('../models/pharmacies');

/* GET pharmacy listing. 
router.get('/', (req, res) => {
  
});*/

//ajout nouvelle pharmacie
router.post('/addPharma', (req, res) => {
    const { name, adresse, city, tel, horaires, coordonnées, garde } = req.body;

    Pharmacy.findOne({ name: name }).then(pharmacy => {
        if (pharmacy === null) {
            const newPharmacy = new Pharmacy({
                name,
                adresse,
                city,
                tel,
                horaires,
                coordonnées,
                garde
            });
        
            newPharmacy.save().then(newDoc => {
              res.json({ result: true, pharmacy: newDoc });
            });
        } else {
            res.json({ result: false, error: 'La pharmacie existe déjà' });
        }
      });
      
});

//requête pharmacie de garde
router.get('/garde', (req, res) => {
    Pharmacy.find({garde: true})
    .then(dataPharmacy => {
        if (dataPharmacy.length > 0){      
            res.json({result: true, dataPharmacy})
        } else {
            res.json({result: false, error: 'Pas de pharmacie de garde'})
        }
    })
})

module.exports = router;