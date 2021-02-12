// dans models

const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = mongoose.Schema({
    email : { 
        type : String,
        required : [true, "email required"],
        unique : true,
        trim : true
    },
    emailMasked : {
        type : String,
        required : [true, "email required"],
        trim : true
    },
    password : { 
        type : String,
        required : [true, "password required"],
        trim : true
    }
})

//passage du schema au validateur d'email unique
userSchema.plugin(uniqueValidator, {message : "Email already existe !"})

module.exports = mongoose.model("User", userSchema)