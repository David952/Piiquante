const sauceModels = require('../models/sauce');
const fs = require('fs');

/**
 * Middleware de création d'une sauce
 * @param req - On récupère une sauce, l'id de l'utilisateur, le protocole 'HTTP', l'hôte du serveur et le nom de l'image
 * @param res - On renvoi un message si l'enregistrement a été validé ou non
 */
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new sauceModels({
        ...sauceObject,
        _userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
    });
    sauce.save()
    .then(() => { res.status(201).json({ message: 'Sauce enregistré !'})})
    .catch(error => { res.status(400).json({ error })})
}

/**
 * Middleware de récupération de toutes les sauces
 * @param res - On renvoi un message si on bien toutes les sauces ou non
 */
exports.getAllSauces = (req, res) => {
    sauceModels.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

/**
 * Middleware de récupération d'une seule sauce
 * @param req - On récupère l'id d'une sauce
 * @param res - On renvoi un message si on bien une sauce ou non
 */
exports.getOneSauce = (req, res) => {
    sauceModels.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

/**
 * Middleware de modification d'une sauce
 * @param req - On récupère l'id puis l'ensemble des éléments du 'body'
 * @param res - On renvoi un message si on a modifié une sauce ou non
 */
exports.modifySauce = (req, res) => {
    sauceModels.updateOne({
            _id: req.params.id
        }, {
            // L'opérateur spread "..." permet de faire une copie de tous les éléments de 'req.body'
            ...req.body,
            _id: req.params.id
        })
        .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => res.status(400).json({ error }));
}

/**
 * Middleware de suppression d'une sauce
 * @param req - On récupère l'id et on fait une vérification entre l'id d'un utilisateur et celle de la sauce
 * @param res - On renvoi un message si une sauce a été supprimé ou non
 */
exports.deleteSauce = (req, res) => {
    sauceModels.findOne({ _id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Non-autorisé'});
        } else {
            const filename = sauce.imageUrl.split('/images')[1];
            fs.unlink(`images/${filename}`, () => {
                sauceModels.deleteOne({ _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
                            .catch(error => res.status(401).json({ error }));
            });
        }
    })

    .catch(error => { res.status(500).json({ error })})
}

/**
 * Middleware j'aime ou je n'aime pas une sauce
 * @param req - On récupère l'id de l'utilisateur, de la sauce et de 'like'
 * @param res - On renvoi un message si on aime une sauce, on aime pas une sauce ou si on retire un like ou un dislike
 */
exports.likesAndDislikes = (req, res) => {
    sauceModels.findOne({ _id: req.params.id})
        .then(sauce => {
            switch(req.body.like) {
                // Vérification que l'utilisateur n'a pas déjà liké la sauce (n'existe pas dans le tableau des utilisateurs)
                case 1:
                    if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                        sauceModels.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { likes: 1 },
                                $push: { usersLiked: req.body.userId }
                            }
                        )
                            .then(() => res.status(201).json({ message: "J'aime cette sauce !"}))
                            .catch((error) => res.status(400).json({ error }));
                    }
                    break;
                // Vérification que l'utilisateur n'a pas déjà disliké la sauce (n'existe pas dans le tableau des utilisateurs)
                case -1:
                    if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
                        sauceModels.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { dislikes: 1 },
                                $push: { usersDisliked: req.body.userId }
                            }
                        )
                            .then(() => res.status(201).json({ message: "Je n'aime pas cette sauce !"}))
                            .catch((error) => res.status(400).json({ error }));
                    }
                    break;
                // Vérification que l'utilisateur n'a pas déjà liké ou disliké la sauce (existe dans le tableau des utilisateurs)
                case 0:
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        sauceModels.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { likes: -1 },
                                $pull: { usersLiked: req.body.userId }
                            }
                        )
                            .then(() => res.status(201).json({ message: "Votre 'j'aime' a bien été retiré"}))
                            .catch((error) => res.status(400).json({ error }));
                    }

                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        sauceModels.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { dislikes: -1 },
                                $pull: { usersDisliked: req.body.userId }
                            }
                        )
                            .then(() => res.status(201).json({ message: "Votre 'je n'aime pas' a bien été retiré"}))
                            .catch((error) => res.status(400).json({ error }));
                    }
                    break;
                default:
                    return new Error('Exception non gérée par le système');
            }
        })

        .catch(error => { res.status(500).json({ error })});
}