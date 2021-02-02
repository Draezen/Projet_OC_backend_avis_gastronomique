const passwordValidator = require("password-validator")

const schema = new passwordValidator()

schema
.is().min(8)             // minimum length 8
.is().max(64)            // max length 100
.has().uppercase()       // must have uppercase  
.has().lowercase()       // must have lowercase
.has().digits()          // must have digits
.has().symbols()         // must have symbols
.has().not().spaces()    // should not have spaces

module.exports = schema