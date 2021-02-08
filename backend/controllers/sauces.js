const Sauce = require("../models/Sauces")

//package node file system, donne acces aux fonctions qui permettent de modifier le systeme de fichier
const fs = require("fs")


exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error : "Connexion failed" }))
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error : "unknow id"}))
}

exports.createSauce = (req, res, next) => {
    const sauceObject = req.body

    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes : 0,
        dislikes :0,
        usersLiked : [],
        usersDisliked : [],
    })
        //enregistrement dans la bdd
        sauce.save()
        .then(() => res.status(201).json({ message : "Object saved !"}))
        .catch(error =>  {
            const errorMessage = error.message
            res.status(400).json({  errorMessage })
        })
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.body

    if ( req.file) {
        sauce = {
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        }
    } else {
       sauce = {
           ...sauceObject,
       }
    }
    Sauce.updateOne({ _id: req.params.id }, { ...sauce, _id: req.params.id })
        .then(() => res.status(200).json({ message : "Object modified !"}))
        .catch(error => res.status(400).json({ error }))
}


exports.deleteSauce = (req, res, next) => {
   //recherche dans la base de l'adresse de l'image à suppr
   Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        //récupération du nom du fichier
        const filename = sauce.imageUrl.split("/images")[1]
        //suppression du fichier
        fs.unlink(`images/${filename}`, () =>{
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message : "Object deleted !"}))
            .catch(error => res.status(400).json({ error }))
        })
    })
    .catch(error => res.status(500).json({ error }))
}

exports.likeSauce = (req, res, next) => {
    //recherche de la sauce à liker dnas la base
    Sauce.findOne({ _id: req.params.id })
        .then (sauce => {
            let sauceObject ={
                likes : sauce.likes,
                dislikes : sauce.dislikes,
                usersLiked : sauce.usersLiked,
                usersDisliked : sauce.usersDisliked,
            }
            switch (req.body.like) {
                case 1:
                    sauceObject.usersLiked.push(req.body.userId)
                    sauceObject.likes ++
                    break
                case -1:
                    sauceObject.usersDisliked.push(req.body.userId)
                    sauceObject.dislikes ++
                    break
                case 0:
                    let i = sauceObject.usersLiked.indexOf(req.body.userId)
                    if (i !== -1) {
                        sauceObject.usersLiked.splice(i, 1)
                        sauceObject.likes --
                    }
                    let j = sauceObject.usersDisliked.indexOf(req.body.userId)
                    if (j !== -1) {
                        sauceObject.usersDisliked.splice(j, 1)
                        sauceObject.dislikes --
                    }
                    break
                default:
                    break
            }
            //mise a jour de la sauce
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({ message : "Objet modified !"}))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(400).json({ error }))
}

