const passwordValidator = require("../models/Password")

module.exports = (req, res, next) => {
    // passage du mot de passe au validateur
    if (passwordValidator.validate(req.body.password)) {
        next()
    } else {
        res.status(400).json({ error: "Password not strong enough !" })
    }
}