//multer = gérer les fichiers entrants dans les requêtes HTTP
const multer = require("multer")

const MIME_TYPES = {
    'image/jpg': "jpg",
    "image/jpeg": "jpg",
    'image/png': "png"
}

const memoryStorage = multer.memoryStorage()


module.exports = multer({storage: memoryStorage}).single("image")