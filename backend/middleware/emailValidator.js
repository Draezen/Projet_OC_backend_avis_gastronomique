const bodyParser = require("body-parser");
const validator = require ("validator")

module.exports = (req, res, next) => {
    //vérification de l'email
    const emailTrimmed = validator.trim(req.body.email)
    if (validator.isEmail(emailTrimmed)){
        next()
    } else {
        res.status(400).json({ error: "Wrong email !" })
    }
}