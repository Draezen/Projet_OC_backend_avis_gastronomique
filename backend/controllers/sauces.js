const Sauce = require("../models/Sauces")

//package node file system, donne acces aux fonctions qui permettent de modifier le systeme de fichier
const fs = require("fs")

const renameFile = require("../middleware/renameFile")

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error : "Connexion failed" }))
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error : "Unknown Id, object does not exists !"}))
}

exports.createSauce = (req, res, next) => {
    const sauceObject = req.body

    const fileName = renameFile(req.file)

    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${fileName}`,
        likes : 0,
        dislikes :0,
        usersLiked : [],
        usersDisliked : [],
    })
        //enregistrement dans la bdd
        sauce.save()
        .then(() => {
            fs.writeFileSync('images/'+ fileName , req.file.buffer)
            res.status(201).json({ message : "Object saved !"})
        })
        .catch(error =>  {
            const errorMessage = error.message
            res.status(400).json({  errorMessage })
        })
}

exports.modifySauce = (req, res, next) => {
    delete req.body.likes
    delete req.body.dislikes
    delete req.body.usersLiked
    delete req.body.usersDisliked

    const sauceObject = req.body
    let sauce = {}

    if ( req.file) {
        //recherche de l'url de l'ancienne image pour le supprimer
        Sauce.findOne({ _id: req.params.id })
        .then(sauceDb => {
            //récupération du nom du fichier à supprimer
            const fileToDelete = sauceDb.imageUrl.split("/images/")[1]
            //création du nom de la nouvelle image à enregistrer
            const fileName = renameFile(req.file)
            //enregistrement de l'image sur le disque
            fs.writeFile('images/'+ fileName , req.file.buffer, (err) => {
                if (err) {
                    return res.status(400).json({ error: err })
                } else {
                    sauce = {
                        ...sauceObject,
                        imageUrl: `${req.protocol}://${req.get("host")}/images/${fileName}`
                    }
                    //suppression de l'ancienne image
                    fs.unlinkSync(`images/${fileToDelete}`)
                    //modif des données de la sauce
                    Sauce.updateOne({ _id: req.params.id }, { ...sauce, _id: req.params.id })
                        .then(() => res.status(200).json({ message : "Object modified !"}))
                        .catch(error => res.status(400).json({ error : "Error when update to mongoDB" }))
                }
            })
        })
        .catch(error => {
                return res.status(500).json({ error : "Unknown Id, object does not exists !" })
            })
    } else {
       sauce = {
           ...sauceObject,
       }
        //modif des données de la sauce
        Sauce.updateOne({ _id: req.params.id }, { ...sauce, _id: req.params.id })
            .then(() => res.status(200).json({ message : "Object modified !"}))
            .catch(error => res.status(400).json({ error : "Error when update to mongoDB" }))
    }
}

exports.deleteSauce = (req, res, next) => {
   //recherche dans la base de l'adresse de l'image à suppr
   Sauce.findOne({ _id: req.params.id })
    .then(sauceDb => {
        //récupération du nom du fichier
        const filename = sauceDb.imageUrl.split("/images")[1]
        //suppression du fichier
        fs.unlink(`images/${filename}`, () =>{
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message : "Object deleted !"}))
            .catch(error => res.status(400).json({ error }))
        })
    })
    .catch(error => res.status(500).json({ error : "Unknown Id, object does not exists !" }))
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
             //vérificaiton dans la bdd si l'utilisateur à liké ou disliké la sauce
            const userHasLiked = sauceObject.usersLiked.indexOf(req.body.userId)
            const userHasDisliked = sauceObject.usersDisliked.indexOf(req.body.userId)

            switch (req.body.like) {
                case 1:
                    if (userHasLiked === -1 && userHasDisliked === -1) {
                        sauceObject.usersLiked.push(req.body.userId)
                        sauceObject.likes = sauceObject.usersLiked.length
                        break
                    } else {
                        return res.status(400).json({ error : "You already marked this sauce !" })
                    }
                case -1:
                    if (userHasLiked === -1 && userHasDisliked === -1) {
                    sauceObject.usersDisliked.push(req.body.userId)
                    sauceObject.dislikes = sauceObject.usersDisliked.length
                    break
                } else {
                    return res.status(400).json({ error : "You already marked this sauce !" })
                }
                case 0: 
                    if (userHasLiked !== -1) {
                        sauceObject.usersLiked.splice(userHasLiked, 1)
                        sauceObject.likes = sauceObject.usersLiked.length
                    }        
                    if (userHasDisliked !== -1) {
                        sauceObject.usersDisliked.splice(userHasDisliked, 1)
                        sauceObject.dislikes = sauceObject.usersDisliked.length
                    }
                    break
                default:
                    return res.status(400).json({ error : "Invalid number, must be -1, 0 or 1" })
            }
            //mise a jour de la sauce
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({ message : "Objet modified !"}))
                .catch(error => res.status(400).json({ error : "Error when update to mongoDB" }))
        })
        .catch(error => res.status(400).json({ error : "Unknown Id, object does not exists !" }))
}

