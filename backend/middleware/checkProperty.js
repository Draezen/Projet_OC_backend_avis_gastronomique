const Sauce = require("../models/Sauces")

const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauceDb => {
                //split de la chaine de caractère pour récupérer la partie token
                const token = req.headers.authorization.split(" ")[1]
                //vérification du token à l'aide de la clé d'encodage
                const decodedToken = jwt.verify(token, process.env.JWT_TOKEN)
                //récupération de l'id
                const userId = decodedToken.userId
                //si id présent mais différent de celui de la base
                if ( sauceDb.userId !== userId) {
                    res.status(401).json({ error : "Invalid user Id !" })
                } else {
                    next()
                }

        })
        .catch(error => res.status(500).json({ error : "Unknown Id, object does not exists !" }))
}

