//importer express
const express = require("express")
//importer body-parser pour gérer le corps de la demande
const bodyParser = require("body-parser")
//package qui facilite les intéraction avec MongoDB
const mongoose = require("mongoose")

//package node pour trouver le chemin d'un ficher/dossier
const path = require("path")

//import du router
const userRoutes = require("./routes/user")
const saucesRoutes = require ("./routes/sauces")

//connexion à mongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.btncq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//créer l'application express
const app = express()

app.use((req, res, next) => {
    //permet d'accéder à l'api de n'importe quelle origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    //permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //permet d'envoyer des requêtes avec les méthodes mentionnées 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//analyse du corps de la demande
app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")))

//utilisation du router
app.use("/api/auth", userRoutes)
app.use("/api/sauces", saucesRoutes)

//exporter l'application pour y accéder depuis les autres fichiers du projet (ex server node)
module.exports = app