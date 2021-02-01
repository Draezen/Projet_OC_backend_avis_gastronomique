const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try {
        //split de la chaine de caractère pour récupérer la partie token
        const token = req.headers.authorization.split(" ")[1]
        //vérification du token à l'aide de la clé d'encodage
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN)
        //récupération de l'id
        const userId = decodedToken.userId
        //si id présent mais différent de celui de la base
        if (req.body.userId && req.body.userId !== userId) {
            throw "Invalid user ID"
        } else {
            next()
        }
    } catch {
        res.status(401).json({ error: new Error("Invalid request !") })
    }
}

