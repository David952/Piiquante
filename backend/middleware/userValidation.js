const validator = require("validator");

// Regex pour valider une adresse e-mail
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Regex pour valider un mot de passe (au moins 8 caractères, une majuscule, une minuscule, un chiffre, un caractère spécial)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Fonction de validation pour l'e-mail
function validateEmail(email) {
  return validator.matches(email, emailRegex);
}

// Fonction de validation pour le mot de passe
function validatePassword(password) {
  return validator.matches(password, passwordRegex);
}

module.exports = { validateEmail, validatePassword };