const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

// On cible le chemin puis on appelle le fichier user dans "controllers"
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;