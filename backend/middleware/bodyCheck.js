//check if body is empty
module.exports = (req, res, next) => {
    if (Object.entries(req.body).length === 0){
        res.status(400).json({ error: "Request body is empty" })
    } else {
        next()
    }
}