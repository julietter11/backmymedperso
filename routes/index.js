require('dotenv').config();
var express = require("express");
var router = express.Router();

require('../models/connection');




const cloudinary = require("cloudinary").v2;

const uniqid = require("uniqid");
const fs = require("fs");

//route pour poster les photos dans le Cloudinary
router.post('/upload', async (req, res) => {
  console.log("req", req);
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


/* GET home page. 
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
*/


module.exports = router;
