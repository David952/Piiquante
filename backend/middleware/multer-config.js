const multer = require('multer');
const path = require('path');
const { validateFilename } = require('../middleware/sauceValidation');

// On définit les extensions des images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/**
 * On configure multer avec la destination de sauvegarde de l'image et son nom
 * @param file - On récupère le nom de l'image et on s'assure que l'image envoyée correspond à l'extension de la liste établie si dessus
 * @param callback - Le nom du dossier de sauvegarde et le nom de l'image avec son extension
 */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        // Utiliser une fonction de validation avant de créer le nom du fichier
        if (validateFilename(file.originalname)) {
            const nameWithoutExtension = path.parse(file.originalname).name;
            const name = nameWithoutExtension.split(' ').join('_');
            const extension = MIME_TYPES[file.mimetype];
            callback(null, name + '_' + Date.now() + '.' + extension);
        } else {
            callback(new Error('Nom de fichier non valide'), null);
        }
    }
});

module.exports = multer({ storage }).single('image');