const MIME_TYPES = {
    'image/jpg': "jpg",
    "image/jpeg": "jpg",
    'image/png': "png"
}

const renameFile = (file) => {
    //suppression des espace et remplacement par des _
    const fileComplet = file.originalname.split(" ").join("_")
    //suppression de l'extension dans le nom du fichier
    const fileName = fileComplet.substr(0, fileComplet.lastIndexOf(".")) || fileComplet
    //modification de l'extension
    const extension = MIME_TYPES[file.mimetype]
    //création du nom complet du fichier
    return(fileName + "_" + Date.now() + "." + extension)
}

module.exports = renameFile