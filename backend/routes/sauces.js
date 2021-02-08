//dans routes

const express = require ("express")
const router = express.Router()

const saucesCtrl = require("../controllers/sauces")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")
const datasValidator = require("../middleware/datasValidator")

//affichage de toutes les sauces
router.get("/", auth, saucesCtrl.getAllSauces)
//affichage du détail d'une sauce
router.get("/:id", auth, saucesCtrl.getOneSauce)
//ajouter une sauce
router.post("/",auth, multer, datasValidator, saucesCtrl.createSauce)
//modifier une sauce
router.put("/:id", auth, multer, saucesCtrl.modifySauce)
//supprimer une sauce
router.delete("/:id", auth, saucesCtrl.deleteSauce)
//liker une sauce
router.post("/:id/like", auth, saucesCtrl.likeSauce)

module.exports = router