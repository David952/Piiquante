const fs = require('fs');

// Validation du nom de l'image
function validateFilename(filename) {
    // Expression régulière autorisant les caractères alphanumériques, espaces, tirets, underscores et points.
    const allowedCharacters = /^[a-zA-Z0-9\s\-_.]+$/;

    // Vérifier si le nom de fichier respecte l'expression régulière
    try {
        if (allowedCharacters.test(filename)) {
            return filename;
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
}

// Validation des champs obligatoires
function sauceDataValid(sauce) {
    if (!sauce.name || !sauce.manufacturer || !sauce.description || !sauce.mainPepper || !sauce.heat) {
        throw 'Une image et les champs name, manufacturer, description, main pepper et heat sont obligatoires.';
    }
}

// Validation du champ heat entre 1 et 10
function heatValid(heat) {
    if (isNaN(heat) || parseInt(heat) < 1 || parseInt(heat) > 10) {
        throw 'Le champ heat doit être un nombre entre 1 et 10.';
    }
}

module.exports = { validateFilename, sauceDataValid, heatValid };