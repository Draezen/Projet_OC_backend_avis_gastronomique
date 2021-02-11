const { body, validationResult } = require("express-validator")

const dataFormat = (req, res, next) => {
    const sauceObject = req.file ? JSON.parse(req.body.sauce) : req.body
    req.body = sauceObject
    next()
}

//rules for valide datas
const datasValidationRules = () => {
    return [
        body("name")
            .trim()
            .blacklist('\<\>\&\$\=\`')
            .notEmpty()
            .withMessage("Name cannot be empty"),
        body("manufacturer")
            .trim()
            .blacklist('\<\>\&\$\=\`')
            .notEmpty()
            .withMessage("Manufacturer cannot be empty"),
        body("description")
            .trim()
            .blacklist('\<\>\&\$\=\`')
            .notEmpty()
            .withMessage("Description cannot be empty"),
        body("mainPepper")
            .trim()
            .blacklist('\<\>\&\$\=\`')
            .notEmpty()
            .withMessage("MainPepper cannot be empty"),
        body("heat")
            .trim()
            .blacklist('\<\>\&\$\=\`')
            .notEmpty()
            .withMessage("Heat cannot be empty")
            .isInt({min: 1, max: 10})
            .withMessage("Must be an integer between 1 and 10"),
        body("userId")
            .trim()
            .blacklist('\<\>\&\$\=\`')
            .isAlphanumeric()
            .withMessage("userId must be alphanumeric")
            .notEmpty()
            .withMessage("userId cannot be empty"),
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    return res.status(422).json({ errors: errors.array() })
  }

module.exports = {
    dataFormat,
    datasValidationRules, 
    validate
}