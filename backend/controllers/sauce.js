const sauceModels = require('../models/sauce');
const fs = require('fs');

// On enregistre la sauce dans la base de données
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new sauceModels({
        ...sauceObject,
        _userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => { res.status(201).json({ message: 'Sauce enregistré !'})})
    .catch(error => { res.status(400).json({ error })})
}

// On récupère toutes les sauces
exports.getAllSauce = (req, res, next) => {
    sauceModels.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({
            error
        }));
}

// On récupère une seule sauce
exports.getOneSauce = (req, res, next) => {
    sauceModels.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({
            error
        }));
}

//On modifie une sauce
exports.modifySauce = (req, res, next) => {
    sauceModels.updateOne({
            _id: req.params.id
        }, {
            // L'opérateur spread "..." permet de faire une copie de tous les éléments de 'req.body'
            ...req.body,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Sauce modifié !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
}

//On supprime une sauce
exports.deleteSauce = (req, res, next) => {
    sauceModels.findOne({ _id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Non-autorisé'});
        } else {
            const filename = sauce.imageUrl.split('/images')[1];
            fs.unlink(`images/${filename}`, () => {
                sauceModels.deleteOne({ _id: req.params.id })
                            .then(() => { res.status(200).json({ message: 'Sauce supprimé !'})})
                            .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch(error => {
        res.status(500).json({})
    })
        
}