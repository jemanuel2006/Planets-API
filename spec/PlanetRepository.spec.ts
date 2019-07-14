import 'jasmine';
import { MongoClient, ObjectID } from 'mongodb'
import { DatabaseConfig } from '../app/repositories/DatabaseConfig';
import { PlanetRepository } from '../app/repositories/PlanetRepository';
import { Planet } from '../app/domain/Planet';

let config = new DatabaseConfig("mongodb://localhost", "tests")

describe("PlanetRepository integration tests", () =>{
    let repository = new PlanetRepository(config);

    afterAll(async () =>{
        let client = new MongoClient(config.ConnString);
        await client.connect();
        client.db(config.MainCollection).dropDatabase();
    });

    describe("add", () =>{
        let p = new Planet("TestPlanet", "Climate", "GroundType", 2);

        it("should add planet", async () =>{
            let planet = await repository.add(p);

            expect(planet._id).not.toEqual(0);
        })
    });

    describe("getAll", () =>{

        beforeEach(async () =>{
            for(var i = 1; i < 11; i++){
                let p = new Planet("Star " + i.toString(), "Climate", "GroundType", 2);
                await repository.add(p);
            }
        }, 999999);

        it("should get first 5 planets with name like 'Star'", async () =>{
            let planets = await repository.getAll("Star", "", 5, 0);

            expect(planets.length).toEqual(5);
            expect(planets[0].Name).toContain("Star");
            expect(planets[1].Name).toContain("Star");
            expect(planets[2].Name).toContain("Star");
            expect(planets[3].Name).toContain("Star");
            expect(planets[4].Name).toContain("Star");
        })
    });

    describe("getById", () =>{

        it("should get the planet by its id", async () =>{
            let p = new Planet("Happy Planet", "Climate", "GroundType", 2);
            await repository.add(p);

            let id = p._id;

            let planet = await repository.getById(id.toString());

            expect(planet._id).toEqual(id);
            expect(planet.Name).toEqual("Happy Planet");
        })
    });

    describe("delete", () =>{
        it("should delete the planet by its id", async () =>{
            let p = new Planet("Happy Planet", "Climate", "GroundType", 2);
            await repository.add(p);

            let id = p._id;
            await repository.delete(id.toString());
            let error = undefined;
            try{
                await repository.getById(id.toString())
            }
            catch(ex){
                error = ex;
            }

            expect(error).toBeDefined();
            expect(error._message).toEqual(`Planet with Id = ${id} not found.`);
        })
    });
});