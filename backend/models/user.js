const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// On crée un schéma pour l'utilisateur et on s'assure que l'email est unique
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// On s'assure qu'il est impossible de créer plusieurs comptes avec la même adresse email
userSchema.plugin(uniqueValidator);

// On exporte ce schéma en modèle utilisable
module.exports = mongoose.model('User', userSchema);