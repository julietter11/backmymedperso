var express = require('express');
var router = express.Router();

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL)
const uniqid = require('uniqid');
const fs = require('fs');
const User = require('../models/users');

router.post('/upload', async (req, res) => {
  const photoPath = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);

  if (!resultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    res.json({ result: true, url: resultCloudinary.secure_url });
  } else {
    res.json({ result: false, error: resultMove });
  }

  fs.unlinkSync(photoPath);
});



//route pour poster enregistrer url ordonnances pour chaque user

router.post("/upload/:token", async (req, res) => {
    //console.log("req", req);
    const photoPath = `/tmp/${uniqid()}.jpg`;
    const resultMove = await req.files.photoFromFront.mv(photoPath);
    const user = await User.findOne({token: req.params.token})
  
    if (!resultMove) {
      const resultCloudinary = await cloudinary.uploader.upload(photoPath);
  
      if(resultCloudinary) {
        User.updateOne({_id: user._id}, { $push: {ordonnances: resultCloudinary.secure_url }})
        .then(() => {
          res.json({result: true, url: resultCloudinary.secure_url})
        })
      }
      //res.json({ result: true, url: resultCloudinary.secure_url });
    } else {
      res.json({ result: false, error: resultMove });
    }
    fs.unlinkSync(photoPath);
  });



  //liste des ordonnances users
router.get("/upload/:token", (req, res) => {
    const { token } = req.params;
  
    User.findOne({ token: token }).then((data) => {
      res.json({ result: true, ordonnances: data.ordonnances });
    });
  });
  
  //supprimer photo utilisateur dans la BDD 
  router.put("/deletePhoto/:token", (req, res) => {
    const { token } = req.params;
    const { url } = req.body;
  
    User.findOne({ token: token }).then((user) => {
      if (user === null) {
        res.json({ result: false, error: "Utilisateur non trouvé" });
        return;
      }
  
      if (user.ordonnances.includes(url)) {
        User.updateOne({ _id: user._id }, { $pull: { ordonnances: url } }).then(
          () => {
            res.json({ result: true, message: "Ordonnance supprimée" });
          }
        );
      }
    });
  });

module.exports = router;