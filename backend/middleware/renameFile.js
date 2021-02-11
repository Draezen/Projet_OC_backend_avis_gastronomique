const MIME_TYPES = {
    'image/jpg': "jpg",
    "image/jpeg": "jpg",
    'image/png': "png"
}

const renameFile = (file) => {
    //delete blank space and replace by underscore _
    const fileComplet = file.originalname.split(" ").join("_")
    //delete extension in the file name
    const fileName = fileComplet.substr(0, fileComplet.lastIndexOf(".")) || fileComplet
    //modify extension
    const extension = MIME_TYPES[file.mimetype]
    //create the new name of the file
    return(fileName + "_" + Date.now() + "." + extension)
}

module.exports = renameFile