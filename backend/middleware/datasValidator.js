const validator = require("validator")

module.exports = (req, res, next) => {
    //console.log("validatorrrrrrrrrrrrrrrrrrrrrr");
    if (req.file) {
       // console.log(req.body.sauce);
        const sauceObject = JSON.parse(req.body.sauce)
        validator.blacklist(sauceObject.name, '\<\>\&\$\=\`')
        //console.log(sauceObject);
    } else {
        console.log("ça marche pas !");
    }
    next()
}