import express from 'express';
import Config from './Config.js';
import Routes from './routes/Routes.js';
import Database from './Database.js';
import LoadModulesUtils from './LoadModulesUtils.js';
import cors from "cors";

const app = express();
const port = 3000;
const apiVersion = "V1";
const apiPath = "/api";

// leggi la configurazione
let cfgi = Config.getInstance();
await cfgi.readConfig();

// loads modules set in config 
let lmu = await LoadModulesUtils.getInstance();
await lmu.load();

// inizializza servizio database
let db = Database.getInstance();
await db.initialize();

// INIZIALIZZA EXPRESS
app.use(express.json({ limit: '50mb' }));
app.use(cors()); // This enables CORS for all routes and origins
app.listen(port, () => {
   console.log('Server listening on port 3000');
});

// ROUTES SETUP
let routes = Routes.getInstance();
routes.setupRoutes(app,apiPath,apiVersion);
