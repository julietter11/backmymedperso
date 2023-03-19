var express = require("express");
var router = express.Router();
require('dotenv').config();
require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");


/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

router.post("/signup", (req, res) => {
  if (
    !checkBody(req.body, [
      "firstName",
      "lastName",
      "email",
      "numSecu",
      "password",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const { firstName, lastName, email, numSecu } = req.body;

  // Vérifie la conformité de l'adresse email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "L'adresse email fournie n'est pas valide." });
  }

  // Vérifie la conformité du numéro de sécurité sociale
  const secuRegex =
    /[12][0-9]{2}(0[1-9]|1[0-2])(2[AB]|[0-9]{2})[0-9]{3}[0-9]{3}([0-9]{2})/;
  if (!secuRegex.test(numSecu)) {
    return res
      .status(400)
      .json({
        error: "Le numéro de sécurité sociale fourni n'est pas valide.",
      });
  }

  // // Vérifie si l'utilisateur n'est pas déjà enregistré
  User.findOne({ $or: [{ email }, { numSecu }] }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstName,
        lastName,
        email,
        numSecu,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "L'utilisateur est déjà crée" });
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({
      result: false,
      error: "Veuillez remplir tous les champs de saisie",
    });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({
        result: false,
        error: "L'utilisateur n'existe pas ou le mot de passe est incorrect",
      });
    }
  });
});

//recherche utilisateur par token
router.get("/:token", async (req, res) => {
  const { token } = req.params;

  const user = await User.find({ token: token });
  if (!user) {
    return res.json({ message: "user not found" });
  } else {
    return res.json({
      result: true,
      firstName: user[0].firstName,
      lastName: user[0].lastName,
      email: user[0].email,
    });
  }
});

//liste des médoc liké par un user
router.get("/:token/likeMed", (req, res) => {
  const { token } = req.params;

  User.find({ token: token }).then((data) => {
    res.json({ result: true, like: data[0].likes });
  });
});

//supprimer un utilisateur
router.delete("/delete/:token", async (req, res) => {
  User.deleteOne({ token: req.params.token }).then((data) => {
    console.log(data);
    if (data.deletedCount > 0) {
      res.json({ result: true, message: "Utilisateur supprimé avec succès" });
    } else {
      res.json({ result: false, message: "utilisateur introuvable" });
    }
  });
});

//changer mot de passe
router.put("/:token/updatePassword", async (req, res) => {
  const { token } = req.params;
  const { currentPassword, newPassword } = req.body;

  const hash = bcrypt.hashSync(newPassword, 10);

  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.json({ message: "L'utilisateur n'existe pas." });

    // Vérifier si le mot de passe actuel correspond
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Le mot de passe actuel est incorrect." });

    // Mettre à jour le mot de passe de l'utilisateur
    const updatedUserPassword = await User.findOneAndUpdate(
      { token: token },
      { password: hash },
      { new: true }
    );
    res.json({ result: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message:
          "Une erreur est survenue lors de la mise à jour du mot de passe.",
      });
  }
});

//changer email utilisateur
router.put("/:token/updateEmail", async (req, res) => {
  const { token } = req.params;
  const { currentPassword, newEmail } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.json({ message: "L'utilisateur n'existe pas." });

    // Vérifier si le mot de passe actuel correspond
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Le mot de passe actuel est incorrect." });

    // Mettre à jour l'email de l'utilisateur
    const updatedUserEmail = await User.findOneAndUpdate(
      { token: token },
      { email: newEmail },
      { new: true }
    );
    res.json({ result: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message:
          "Une erreur est survenue lors de la mise à jour du mot de passe.",
      });
  }
});



module.exports = router;
