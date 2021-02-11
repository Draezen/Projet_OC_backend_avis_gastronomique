//in routes

const express = require ("express")
const router = express.Router()

//Limit repeated requests
const rateLimit = require("express-rate-limit")
//Check if body il empty
const bodyCheck = require("../middleware/bodyCheck")
//Validate user and password rules
const { userValidationRules, validate } = require("../middleware/userValidator")

const userCtrl = require("../controllers/user")

const loginLimiter = rateLimit({
    windowsMs: 15 * 60 * 1000,
    max: 100,
    message : "Too many login for this IP, please try again after 15min"
})

router.post("/signup", bodyCheck ,userValidationRules(), validate , userCtrl.signup)
router.post("/login", loginLimiter, bodyCheck, userCtrl.login)

module.exports = router

