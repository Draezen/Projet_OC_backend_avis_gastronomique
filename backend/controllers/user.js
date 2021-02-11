// in controllers

const bcrypt = require ("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/User")

const cryptoJS = require ("crypto-js")
const maskData = require("maskdata")

exports.signup = (req, res, next) => {
    //hash of password, method async
    bcrypt.hash(req.body.password, 10)
        //create a new user
        .then( hash => {
            const user = new User({
                email: cryptoJS.HmacSHA512(req.body.email, process.env.CRYPTO_JS_KEY).toString(),
                emailMasked: maskData.maskEmail2(req.body.email),
                password: hash
            })
            //save user in database
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur crée !" }))
                .catch(error =>  {
                    const errorMessage = error.message
                    res.status(400).json({  errorMessage })
                })
        })
        .catch(error => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
    User.findOne({ email: cryptoJS.HmacSHA512(req.body.email, process.env.CRYPTO_JS_KEY).toString() })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Wrong email or password !" })
            }
            //compare hashed passwords 
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ error: "Wrong email or password !" })
                    }
                    //return userId and token
                    res.status(200).json({
                        userId: user._id,
                        //use sign function to encode a new token
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_TOKEN,
                            { expiresIn: "24h" }
                        )
                    })
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error : "Connection failed" }))
}