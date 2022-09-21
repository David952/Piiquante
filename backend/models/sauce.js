const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  // ID de l'utilisateur qui a crée la sauce
  userId: { type: String, required: true },

  name: { type: String, required: true },

  // Fabricant de la sauce
  manufacturer: { type: String, required: true },

  description: { type: String, required: true },

  // Le principal ingrédient épicé de la sauce
  mainPepper: { type: String, required: true },

  imageUrl: { type: String, required: true },

  // Note décrivant la sauce
  heat: { type: Number, required: true },

  likes: { type: Number },

  dislikes: { type: Number },

  // Tableau des identifiants des utilisateurs qui ont aimé la sauce
  usersLiked: { type: [String] },
  // Tableau des identifiants des utilisateurs qui n'ont pas aimé la sauce
  usersDisliked: { type: [String] },
});

module.exports = mongoose.model('Sauce', sauceSchema);