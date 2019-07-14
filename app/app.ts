import express = require('express');
import bodyParser = require('body-parser');

import { PlanetService } from './services/PlanetService';
import { PlanetRepository } from './repositories/planetRepository';
import { PlanetController } from './controllers/PlanetController';
import { HttpRequestService } from './services/HTTPRequestService';
import { DatabaseConfig } from './repositories/DatabaseConfig';

// Create a new express application instance
const app: express.Application = express();

const planetController = new PlanetController(
    new PlanetService(
        new PlanetRepository(
            new DatabaseConfig("mongodb://localhost", "planets")), 
    new HttpRequestService()));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/planets', planetController.create.bind(planetController));
app.get('/planets', planetController.getAll.bind(planetController));
app.get('/planets/:id', planetController.getById.bind(planetController));
app.delete('/planets/:id', planetController.delete.bind(planetController))

app.listen(3000, function () {
  console.log('Planets API ready on port 3000.');
});