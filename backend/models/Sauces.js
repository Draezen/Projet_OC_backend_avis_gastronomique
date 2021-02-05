//dans models

const mongoose = require("mongoose")

const sauceSchema = mongoose.Schema({
    userId : {
        type : String, 
        required : [true, "userId is required"]
        },
    name : { 
        type : String, 
        required : [true, "name is required"] 
    },
    manufacturer : { 
        type : String, 
        required : [true, "manufacturer is required"] 
    },
    description : {
        type : String, 
        required : [true, "description is required"] 
        },
    mainPepper : {
         type : String, 
         required : [true, "mainPepper is required"] 
        },
    imageUrl : {
        type : String, 
        required : [true, "imageURL is required"] 
        },
    heat : { 
        type : Number, 
        required : [true, "heat is required"], 
        min : [1, "Min value : 1"] , 
        max : [10, "max value 10"]
    } ,
    likes : {
        type : Number, 
        min : [0, "min value 0"] 
        },
    dislikes : {
        type : Number, 
        min : [0, "min value 0"] 
        },
    usersLiked : {
         type : [String] 
        },
    usersDisliked : {
         type : [String] 
        },

})

module.exports = mongoose.model("sauce", sauceSchema)