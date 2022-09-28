const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const path = require('path');

// On utilise "dotenv" pour masquer les informations de la base de données
require("dotenv").config();

// On déclare les routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Connexion à la base de données
mongoose.connect(process.env.DB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// On définit "app" qui utilise express
const app = express();

/**
 * Middleware de sécurité qui bloque les appels HTTP entre des serveurs différents ce qui empêche des requêtes malveillantes qui est nommé CORS « Cross Origin Resource Sharing »
 * @param res - on définit les valeurs avec 'setHeader' pour la sécurité
 * @param next - permet de terminer la fonction pour passer à la suivante
 */
app.use((req, res, next) => {
  //On peut accéder à l'API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Origin', '*');
  //On ajoute les headers mentionnés aux requêtes envoyées vers notre API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  //On envoi des requêtes avec les méthodes mentionnées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); 
  next();
});

// Transforme les données de la requête POST en un objet JSON
app.use(bodyParser.json());

// On définit le chemin puis on appelle la variable où est stocké la route
// On indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname) à chaque fois qu'elle reçoit une requête vers la route /images
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// On exporte "app" qui nous permettre de l'utiliser dans d'autres fichiers
module.exports = app;