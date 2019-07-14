import {Planet} from '../domain/Planet'
import { MongoClient, ObjectID } from 'mongodb'
import { PlanetNotFoundException } from './PlanetNotFoundException';
import { DatabaseConfig } from './DatabaseConfig';

export class PlanetRepository{
    private _configuration : DatabaseConfig;

    constructor(configuration : DatabaseConfig){
        this._configuration = configuration;
    }

    async add(planet : Planet){
        let client = new MongoClient(this._configuration.ConnString);
        await client.connect();
        let db = await client.db(this._configuration.MainCollection);

        let collection = await db.collection("planets");
        planet._id = new ObjectID();
        await collection.insertOne(planet);

        await client.close();

        return planet;
    }

    async getAll(name = "", id = "", pageSize = 10, page = 0){
        let client = new MongoClient(this._configuration.ConnString);
        await client.connect();
        let db = await client.db(this._configuration.MainCollection);

        let collection = await db.collection("planets");
        let filter = {};

        if(name && name != "")
            filter["Name"] = {$regex: name};
        
        if(id && id != "")
            filter["_id"] = id;

        let cursor = await collection.find(filter).skip(page * pageSize).limit(pageSize);

        var list : Planet[];
        list = [];
        cursor.forEach(item => {
            let p = new Planet(item.Name, item.Climate, item.GroundType, item.Apparitions);
            p._id = item._id;
            list.push(p);
        });

        await client.close();

        return list;
    }

    async getById(id : String){
        let client = new MongoClient(this._configuration.ConnString);
        await client.connect();
        let db = await client.db(this._configuration.MainCollection);

        let collection = await db.collection("planets");
        let planet = await collection.findOne({_id : new ObjectID(id.toString())});

        if(planet == null)
            throw new PlanetNotFoundException(`Planet with Id = ${id} not found.`);

        await client.close();

        var p = new Planet(planet.Name, planet.Climate,planet.GroundType, planet.Apparitions);
        p._id = planet._id;

        return p;
    }

    async delete(id : String){
        let client = new MongoClient(this._configuration.ConnString);
        await client.connect();
        let db = await client.db(this._configuration.MainCollection);

        let collection = await db.collection("planets");
        let result = await collection.deleteOne({_id : new ObjectID(id.toString())});

        if(result != null && result.deletedCount && result.deletedCount < 1)
            throw new PlanetNotFoundException(`Planet with Id = ${id} not found.`);

        await client.close();
    }
}