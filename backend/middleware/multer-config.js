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
        const fileComplet = file.originalname.split(" ").join("_")
        //suppression de l'extension dans le nom du fichier
        const fileName = fileComplet.substr(0, fileComplet.lastIndexOf(".")) || fileComplet
        const extension = MIME_TYPES[file.mimetype]
        callback(null, fileName + Date.now() + "." + extension)
    }
})

module.exports = multer({storage: storage}).single("image")