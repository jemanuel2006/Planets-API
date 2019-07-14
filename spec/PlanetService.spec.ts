import 'jasmine';
import { PlanetService } from '../app/services/PlanetService';
import { Planet } from '../app/domain/Planet';
import { ArgumentNullException } from '../app/domain/ArgumentNullException';

describe("PlanetService - getAll", function() {
    let planet = new Planet("Teste", "Climate", "Ground", 0);
    let repository = jasmine.createSpyObj("repository", ['getAll']);
    let http = jasmine.createSpyObj("http", ['get']);
    repository.getAll.and.callFake(() => [planet]);
    let service = new PlanetService(repository, http);

    it("should return list of objects in repository", async function() {
        let result = await service.getAll();
        expect(result).toEqual([planet]);
    });
});

describe("PlanetService - add", function() {
    let repository = jasmine.createSpyObj("repository", ['add']);
    let http = jasmine.createSpyObj("http", ['get']);
    let r = {
        results: [{
            films: ["Movie 1", "Movie 2"]
        }]
    };
    http.get.withArgs("https://swapi.co/api/planets/?search=TestPlanet").and.callFake(() => r);
    let planet : Planet;
    repository.add.and.callFake((p : Planet) => planet = p);
    let service = new PlanetService(repository, http);

    it("should add new planet to the repository", async function() {
        let result = await service.add("TestPlanet", "Climate", "Ground");

        expect(result.Name).toEqual("TestPlanet");
        expect(result.GroundType).toEqual("Ground");
        expect(result.Climate).toEqual("Climate");
        expect(result.Apparitions).toEqual(2);
    });
});

describe("PlanetService - add - Null Parameters", function() {
    let repository = jasmine.createSpyObj("repository", ['add']);
    let http = jasmine.createSpyObj("http", ['get']);
    let r = {
        results: [{
            films: ["Movie 1", "Movie 2"]
        }]
    };
    http.get.and.callFake(() => r);
    let planet : Planet;
    repository.add.and.callFake((p : Planet) => planet = p);
    let service = new PlanetService(repository, http);

    it("should throw exception with empty name", async function() {
        let error = new ArgumentNullException("Parameter 'name' is empty.");
        try{
            await service.add("", "Climate", "Ground");
        }
        catch(ex){
            expect(ex).toEqual(error);
        }
    });

    it("should throw exception with empty climate", async function() {
        let error = new ArgumentNullException("Parameter 'climate' is empty.");
        try{
            await service.add("TestPlanet", "", "Ground");
        }
        catch(ex){
            expect(ex).toEqual(error);
        }
    });

    it("should throw exception with empty ground", async function() {
        let error = new ArgumentNullException("Parameter 'ground' is empty.");
        try{
            await service.add("TestPlanet", "Climate", "");
        }
        catch(ex){
            expect(ex).toEqual(error);
        }
    });
});

describe("PlanetService - add - no response from API", function() {
    let repository = jasmine.createSpyObj("repository", ['add']);
    let http = jasmine.createSpyObj("http", ['get']);
    http.get.withArgs("https://swapi.co/api/planets/?search=TestPlanet").and.callFake(() => null);
    let planet : Planet;
    repository.add.and.callFake((p : Planet) => planet = p);
    let service = new PlanetService(repository, http);

    it("should add new planet to the repository", async function() {
        let result = await service.add("TestPlanet", "Climate", "Ground");
        
        expect(result.Name).toEqual("TestPlanet");
        expect(result.GroundType).toEqual("Ground");
        expect(result.Climate).toEqual("Climate");
        expect(result.Apparitions).toEqual(0);
    });
});

describe("PlanetService - getById", function() {
    let planet = new Planet("Teste", "Climate", "Ground", 0);
    let repository = jasmine.createSpyObj("repository", ['getById']);
    let http = jasmine.createSpyObj("http", ['get']);
    repository.getById.withArgs('RandomId').and.callFake(() => planet);
    let service = new PlanetService(repository, http);

    it("should return object with searched id", async function() {
        let result = await service.getById("RandomId");
        expect(result).toEqual(planet);
    });
});

describe("PlanetService - delete", function() {
    let planet = new Planet("Teste", "Climate", "Ground", 0);
    let repository = jasmine.createSpyObj("repository", ['delete']);
    let http = jasmine.createSpyObj("http", ['get']);
    repository.delete.withArgs('RandomId').and.callFake(() => planet);
    let service = new PlanetService(repository, http);

    it("should delete object with searched id", async function() {
        await service.delete("RandomId");
        expect(repository.delete).toHaveBeenCalled();
    });
});