var express = require("express");
var router = express.Router();

require('dotenv').config();
const User = require('../models/users');
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
const uniqid = require("uniqid");
const fs = require("fs");

//route pour poster les photos dans le Cloudinary
router.post("/upload", async (req, res) => {
  console.log("req", req);
  const photoPath = `/tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);

  if (!resultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    res.json({ result: true, url: resultCloudinary.secure_url });
  } else {
    res.json({ result: false, error: resultMove });
  }
  fs.unlinkSync(photoPath);
});

//essai route pour poster enregistrer url chez user
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

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
