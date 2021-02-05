//dans routes

const express = require ("express")
const router = express.Router()

const rateLimit = require("express-rate-limit")

const bodyCheck = require("../middleware/bodyCheck")
const emailValidator = require("../middleware/emailValidator")
const passwordValidator = require("../middleware/password-validator")

const userCtrl = require("../controllers/user")

const loginLimiter = rateLimit({
    windowsMs: 15 * 60 * 1000,
    max: 100,
    message : "Too many login for this IP, please try again after 15min"
})

router.post("/signup", bodyCheck ,emailValidator ,passwordValidator, userCtrl.signup)
router.post("/login", loginLimiter, bodyCheck, userCtrl.login)

module.exports = router

