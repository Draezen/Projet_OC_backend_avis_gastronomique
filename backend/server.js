//importer le package HTTP de Node
const http = require("http")

//importations des variables d'environnement
require("dotenv").config()

//importer l'application
const app = require("./app")

//renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT);

//definir quel port utiliser 
app.set('port', port);

//recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur ;
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

////créer le server en passant l'appli express comme fonction
const server = http.createServer(app);

//un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
server.on("error", errorHandler)
server.on("listening", () => {
    const address = server.address()
    const bind = typeof address === "string" ? "pipe " + address : "port " + port
    console.log("listening on " + bind);
})

//config du serveur pour qu'il écoute
// soit la var d'environnement du port soit le port 3000
server.listen(port)