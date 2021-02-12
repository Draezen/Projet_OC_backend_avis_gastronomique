const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try {
        //split authorisation header to get the token part
        const token = req.headers.authorization.split(" ")[1]
        //check token with encoding key 
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN)
        //get the id
        const userId = decodedToken.userId
        //if id exist but different from the DB
        if (req.body.userId && req.body.userId !== userId) {
            return res.status(401).json({ error : "Invalid user ID" })
        } else {
            next()
        }
    } catch {
        res.status(401).json({ error : "Wrong token !" })
    }
}

