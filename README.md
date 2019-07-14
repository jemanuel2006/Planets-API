# Planet API

This REST API can be used to do CRUD operations with planets. Movie aparitions in Star Wars franchise will be automatically fetched from https://swapi.co/ automatically (if any).
Supported HTTP Verbs: POST, GET, DELETE.

# Routes

| Route | Verb | Description | Possible Query/Body Parameters |
| ------------- | ------------- | ------------- |
| '/planets'  | GET  | Get the list of all planets.  | Query: pageNumber, pageSize, name, id  |
| '/planets'  | POST  | Create a new planet. Body should contain a JSON with properties.  | Body: name, climate, groundType  |
| '/planets/:id'  | GET  | Get specific planet by its id.  | -- |
| '/planets/:id'  | DELETE  | Delete specific planet by its id.  | -- |

### Prerequisites

To get the Planets API running, you should have installed Node.js and MongoDB.

### Installing

With the prerequisites satisfied, run these commands in the following order:

```
npm install
npm run dev
```

- The default port of the API is 3000, but you can change those defaults in the app.ts file. 
- Default MongoDB instance connection string is "mongodb://localhost", but you can change those defaults in the app.ts file.

## Running the tests

To run the tests, run this command:
```
npm run test
```

## Built With

* [Express.js](https://expressjs.com) - The web framework used
* [MongoDB](https://mongodb.github.io/node-mongodb-native/) - Drive to connect to MongoDB
* [Jasmine](https://jasmine.github.io/) - Testing

## Author

* **Juan Valenzuela** - (https://github.com/jemanuel2006)
