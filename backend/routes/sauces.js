//dans routes

const express = require ("express")
const router = express.Router()

const saucesCtrl = require("../controllers/sauces")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")
const { dataFormat, datasValidationRules, validate } = require("../middleware/datasValidator")
const checkProperty = require("../middleware/checkProperty")

//affichage de toutes les sauces
router.get("/", auth, saucesCtrl.getAllSauces)
//affichage du détail d'une sauce
router.get("/:id", auth, saucesCtrl.getOneSauce)
//ajouter une sauce
router.post("/",auth, multer, dataFormat, datasValidationRules(), validate, saucesCtrl.createSauce)
//modifier une sauce
router.put("/:id", auth, checkProperty, multer, dataFormat, datasValidationRules(), validate, saucesCtrl.modifySauce)
//supprimer une sauce
router.delete("/:id", auth, checkProperty, saucesCtrl.deleteSauce)
//liker une sauce
router.post("/:id/like", auth, saucesCtrl.likeSauce)

module.exports = router