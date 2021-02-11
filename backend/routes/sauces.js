//In routes

const express = require ("express")
const router = express.Router()

const saucesCtrl = require("../controllers/sauces")
//handle auth
const auth = require("../middleware/auth")
//Handle form-data
const multer = require("../middleware/multer-config")
//Check datas validations
const { dataFormat, datasValidationRules, validate } = require("../middleware/datasValidator")
//Check property of an object
const checkProperty = require("../middleware/checkProperty")

//show all sauces
router.get("/", auth, saucesCtrl.getAllSauces)
//show details of a sauce
router.get("/:id", auth, saucesCtrl.getOneSauce)
//add une sauce
router.post("/",auth, multer, dataFormat, datasValidationRules(), validate, saucesCtrl.createSauce)
//modify a sauce
router.put("/:id", auth, checkProperty, multer, dataFormat, datasValidationRules(), validate, saucesCtrl.modifySauce)
//delete une sauce
router.delete("/:id", auth, checkProperty, saucesCtrl.deleteSauce)
//like / dislike a sauce
router.post("/:id/like", auth, saucesCtrl.likeSauce)

module.exports = router