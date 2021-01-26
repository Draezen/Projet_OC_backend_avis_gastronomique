// dans controllers

const bcrypt = require ("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/User")

exports.signup = (req, res, next) => {
    //cryptage du mdp, methode async
    bcrypt.hash(req.body.password, 10)
        //création du nouvel utilisateur
        .then( hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            //savegarde dans la bdd
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur crée !" }))
                .catch(error => res.status(400).JSON({ error }))
        })
        .catch(error => res.status(500).JSON({ error }))
}

exports.login = (req, res, next) => {
    //récupération de l'utilisateur dans la bdd
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non trouvé !" })
            }
            //comparaison des mdp cryptés
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ error: "Mot de passe incorect !" })
                    }
                    //renvoi du userId et un token
                    res.status(200).json({
                        userId: user._id,
                        //utilisation de la fonction sign pour encoder un nouveau token
                        token: jwt.sign(
                            { userId: user._id },
                            "RANDOM_TOKEN_SECRET",
                            { expiresIn: "24h" }
                        )
                    })
                })
                .catch(error => res.status(500).JSON({ error }))
        })
        .catch(error => res.status(500).JSON({ error }))
}