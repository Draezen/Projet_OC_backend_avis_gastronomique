//multer = handle files in the HTTP request
const multer = require("multer")

const MIME_TYPES = {
    'image/jpg': "jpg",
    "image/jpeg": "jpg",
    'image/png': "png"
}

const memoryStorage = multer.memoryStorage()

//store the file in the memory
module.exports = multer({storage: memoryStorage}).single("image")