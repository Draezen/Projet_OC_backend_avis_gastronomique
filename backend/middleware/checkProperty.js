const Sauce = require("../models/Sauces")

const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauceDb => {
                //split authorisation header to get the token part
                const token = req.headers.authorization.split(" ")[1]
                //check token with encoding key 
                const decodedToken = jwt.verify(token, process.env.JWT_TOKEN)
                //get the id
                const userId = decodedToken.userId
                //if id exist but different from the DB
                if ( sauceDb.userId !== userId) {
                    res.status(401).json({ error : "Invalid user Id !" })
                } else {
                    next()
                }

        })
        .catch(error => res.status(500).json({ error : "Unknown Id, object does not exists !" }))
}

