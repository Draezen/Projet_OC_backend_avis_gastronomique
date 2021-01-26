//dans routes

const express = require ("express")
const router = express.Router()

const saucesCtrl = require("../controllers/sauces")

//affichage de toutes les sauces
router.get("/", saucesCtrl.getAllSauces)
//affichage du détail d'une sauce
router.get("/:id", saucesCtrl.getOneSauce)
//ajouter une sauce
router.post("/", saucesCtrl.createSauce)
//modifier une sauce
router.put("/:id", saucesCtrl.modifySauce)
//supprimer une sauce
router.delete("/:id", saucesCtrl.deleteSauce)
//liker une sauce
router.post("/:id/like", saucesCtrl.likeSauce)

module.exports = router