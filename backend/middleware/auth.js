const jwToken = require('jsonwebtoken');

/**
 * Middleware d'authentification qui va vérifier que l'utilisateur utilise bien son token
 * @param req - On récupère le token, on le vérifie puis on le transmet aux autres middlewares et au gestionnaire de route
 * @param res - Affiche une erreur si le token est invalide
 * @param next - On termine l'exécution de la fonction
 */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwToken.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {
            userId : userId
        };
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};