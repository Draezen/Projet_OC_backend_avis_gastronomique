const express = require("express")

const app = express()

app.use((req, res) => {
    res.json({ message : "Votre requête a bien été reçus !" })
})

module.exports = app