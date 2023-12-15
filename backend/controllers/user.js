const bcrypt = require("bcrypt");
const jwToken = require("jsonwebtoken");
const validator = require("validator");

const User = require("../models/user");

const { validateEmail, validatePassword } = require('../middleware/userValidation');

/**
 * Middleware de création d'un compte utilisateur
 * @param req - On récupère l'adresse email et le mot de passe crypté
 * @param res - Si le compte utilisateur a bien été crée le statut passe en "Created", sinon en "Bad request ou une erreur serveur "Internal Server Error"
 */
exports.signup = (req, res) => {
  // Validation
  if (!req.body.email || !req.body.password ) {
    throw Error('Les champs doivent être remplis.')
  }
  if(!validator.isEmail(req.body.email)) {
    throw Error('Email non valide.')
  }
  if(!validator.isStrongPassword(req.body.password)) {
    throw Error('Mot de passe pas assez fort. (Minimum 8 caractères. Au moins une minuscule, une majuscule, un chiffre et un caractère spécial)')
  }

  //Hache du mot de passe et le nombre de fois qu'on exécute l'algorithme de hachage
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur crée !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/**
 * Middleware de connexion d'un compte utilisateur
 * @param req - On récupère l'adresse email puis on compare si le mot de passe indiqué correspond à celui dans la base de données
 * @param res - Renvoi un message si la connexion a échoué avec un statut "Unauthorized" sinon il passe en "OK"
 */
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Valider l'e-mail
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Adresse e-mail invalide" });
  }

  // Valider le mot de passe
  if (!validatePassword(password)) {
    return res.status(400).json({ message: "Mot de passe invalide" });
  }

  User.findOne({ email })
    .then((user) => {
      if (user === null) {
        res.status(401).json({ message: "Identifiant/mot de passe incorrecte" });
      } else {
        bcrypt
          .compare(password, user.password)
          .then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({ message: "Identifiant/mot de passe incorrecte" });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwToken.sign(
                  { userId: user._id },
                  "RANDOM_TOKEN_SECRET",
                  { expiresIn: "24h" }
                ),
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
