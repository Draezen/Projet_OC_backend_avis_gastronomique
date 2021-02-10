//handler for 404 routes
const error404 = (req, res, next) => {
    res.status(404).json({ error : "Route " + req.url + " does not exists !" })
}

module.exports = error404