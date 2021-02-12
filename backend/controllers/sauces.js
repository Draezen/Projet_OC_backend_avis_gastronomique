const Sauce = require("../models/Sauces")
const User = require("../models/User")

//package node file system, handle file system modifications
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

    //Check if user exists in the DB
    User.findOne({ _id: req.body.userId })
        .then (() => {
            const fileName = renameFile(req.file)
        
            const sauce = new Sauce({
                ...sauceObject,
                imageUrl: `${req.protocol}://${req.get("host")}/images/${fileName}`,
                likes : 0,
                dislikes :0,
                usersLiked : [],
                usersDisliked : [],
            })
                //save in database
                sauce.save()
                    .then(() => {
                        fs.writeFileSync('images/'+ fileName , req.file.buffer)
                        res.status(201).json({ message : "Object saved !"})
                    })
                    .catch(error =>  {
                        const errorMessage = error.message
                        res.status(400).json({  errorMessage })
                    })
        })
        .catch(error => res.status(401).json({ error : "Unknown UserId, user does not exists !"}))

}

exports.modifySauce = (req, res, next) => {
    delete req.body.likes
    delete req.body.dislikes
    delete req.body.usersLiked
    delete req.body.usersDisliked
    delete req.body.userId

    const sauceObject = req.body
    let sauce = {}

    if ( req.file) {
        //find url of the last image to delete
        Sauce.findOne({ _id: req.params.id })
        .then(sauceDb => {
            //return name of the last image
            const fileToDelete = sauceDb.imageUrl.split("/images/")[1]
            //create name of the new image
            const fileName = renameFile(req.file)
            //save image on the disk
            fs.writeFile('images/'+ fileName , req.file.buffer, (err) => {
                if (err) {
                    return res.status(400).json({ error: err })
                } else {
                    sauce = {
                        ...sauceObject,
                        imageUrl: `${req.protocol}://${req.get("host")}/images/${fileName}`
                    }
                    //delete last image
                    fs.unlinkSync(`images/${fileToDelete}`)
                    //update datas in DB
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
        //update datas in DB
        Sauce.updateOne({ _id: req.params.id }, { ...sauce, _id: req.params.id })
            .then(() => res.status(200).json({ message : "Object modified !"}))
            .catch(error => res.status(400).json({ error : "Error when update to mongoDB" }))
    }
}

exports.deleteSauce = (req, res, next) => {
    //find url of the last image to delete      
    Sauce.findOne({ _id: req.params.id })
        .then(sauceDb => {
            //return name of the image 
            const filename = sauceDb.imageUrl.split("/images")[1]
            //delete image
            fs.unlink(`images/${filename}`, () =>{
                //delete sauce from the DB
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message : "Object deleted !"}))
                    .catch(error => res.status(400).json({ error }))
            })
        })
        .catch(error => res.status(500).json({ error : "Unknown Id, object does not exists !" }))
}

exports.likeSauce = (req, res, next) => {
    //find sauce in the DB
    Sauce.findOne({ _id: req.params.id })
        .then (sauce => {
            let sauceObject ={
                likes : sauce.likes,
                dislikes : sauce.dislikes,
                usersLiked : sauce.usersLiked,
                usersDisliked : sauce.usersDisliked,
            }
             //Check if user already liked or disliked the sauce
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
            //Update the sauce
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({ message : "Objet modified !"}))
                .catch(error => res.status(400).json({ error : "Error when update to mongoDB" }))
        })
        .catch(error => res.status(400).json({ error : "Unknown Id, object does not exists !" }))
}

