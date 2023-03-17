const Pharmacy = require('../models/pharmacies');
const Medicament = require('../models/medicaments');
const Stock = require('../models/stocks');

async function generateStock() {
  try {
    // Récupérer la liste des pharmacies et des médicaments
    const pharmacies = await Pharmacy.find();
    const medicaments = await Medicament.find();

    // Pour chaque combinaison de médicament et de pharmacie, générer une quantité aléatoire
    const stockData = medicaments.flatMap((medicament) =>
      pharmacies.map((pharmacy) => ({
        medicament: medicament._id,
        pharmacy: pharmacy._id,
        quantity: Math.floor(Math.random() * 100),
      }))
    );

    // Insérer les données de stock dans la base de données
    await Stock.insertMany(stockData);

    console.log('Stock généré avec succès !');
  } catch (error) {
    console.error('Erreur lors de la génération de stock :', error);
  }
}


module.exports = { generateStock };