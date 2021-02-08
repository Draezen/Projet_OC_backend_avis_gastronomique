
const { body, validationResult} = require("express-validator")

const userValidationRules = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email cannot be empty")
      .isEmail()
      .withMessage("Wrong email format : email must be xxx@yyy.zzz")
      .normalizeEmail(),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password cannot be empty")
      .isStrongPassword()
      .withMessage("Password is not strong enough")
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
  userValidationRules,
  validate
}