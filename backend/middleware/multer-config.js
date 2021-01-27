//multer = gérer les fichiers entrants dans les requêtes HTTP
const multer = require("multer")

const MIME_TYPES = {
    'image/jpg': "jpg",
    "image/jpeg": "jpg",
    'image/png': "png"
}

const storage = multer.diskStorage({
    //dossier d'enregistrement
    destination: (req, file, callback) => {
        callback(null, "images")
    },
    //nom du fichier
    filename: (req, file, callback) => {
        //suppression des espace et remplacement par des _
        const name = file.originalname.split(" ").join("_")
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + "." + extension)
    }
})

module.exports = multer({storage: storage}).single("image")