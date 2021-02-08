
const { body, validationResult} = require("express-validator")

const emailValidationRules = () => {
    return [
      body('email')
      .trim()
      .notEmpty()
      .withMessage("Email cannot be empty")
      .isEmail()
      .withMessage("Wrong email format : email must be xxx@yyy.zzz")
      .normalizeEmail()
    ]
  }
  
  const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    return res.status(400).json({ errors: errors.array() })
  }
  
  module.exports = {
    emailValidationRules,
    validate,
  }