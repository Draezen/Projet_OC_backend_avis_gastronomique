// dans models

const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = mongoose.Schema({
    userId : { type : String, required : true }, 
    email : { type : String, required : true, unique : true },
    password : { type : String, required : true }
})

//passage du schema au validateur d'email unique
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema)