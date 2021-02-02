// dans controllers

const bcrypt = require ("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/User")

const cryptoJS = require ("crypto-js")

exports.signup = (req, res, next) => {
    //cryptage du mdp, methode async
    bcrypt.hash(req.body.password, 10)
        //création du nouvel utilisateur
        .then( hash => {
            const user = new User({
                email: cryptoJS.HmacSHA512(req.body.email, process.env.CRYPTO_JS_KEY).toString(),
                password: hash
            })
            //savegarde dans la bdd
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur crée !" }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
    User.findOne({ email: cryptoJS.HmacSHA512(req.body.email, process.env.CRYPTO_JS_KEY).toString() })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "User not found !" })
            }
            //comparaison des mdp cryptés
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ error: "Wrong password !" })
                    }
                    //renvoi du userId et un token
                    res.status(200).json({
                        userId: user._id,
                        //utilisation de la fonction sign pour encoder un nouveau token
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_TOKEN,
                            { expiresIn: "24h" }
                        )
                    })
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}