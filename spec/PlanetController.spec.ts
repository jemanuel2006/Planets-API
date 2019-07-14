import 'jasmine';
import { PlanetController } from '../app/controllers/PlanetController';
import { Planet } from '../app/domain/Planet';
import { ArgumentNullException } from '../app/domain/ArgumentNullException';
import { PlanetNotFoundException } from '../app/repositories/PlanetNotFoundException';

describe("PlanetController - create", function() {
    let service = jasmine.createSpyObj("service", ['add']);
    let planet = new Planet("TestPlanet", "Climate", "Ground", 0);
    service.add.withArgs("TestPlanet", "Climate", "Ground").and.callFake(() => planet);
    let controller = new PlanetController(service);
    let res = jasmine.createSpyObj("res", ['send']);
    res.send.withArgs(planet);

    it("should add new planet with success", async function() {
        let req = {
            body : {
                name : "TestPlanet",
                climate: "Climate",
                groundType: "Ground"
            }
        };

        let result = await controller.create(req, res);
        expect(res.send).toHaveBeenCalledWith(planet);
    });
});

describe("PlanetController - create - with null parameter", function() {
    let service = jasmine.createSpyObj("service", ['add']);
    service.add.withArgs("", "Climate", "Ground").and.callFake(() => {throw new ArgumentNullException("message");});
    let controller = new PlanetController(service);
    let res = jasmine.createSpyObj("res", ['send', 'status']);
    res.status.withArgs(400).and.callFake(() => res);
    let errorObject = {
        statusCode : 400,
        message : "message"
    };
    res.send.withArgs(errorObject);

    it("should return specific error when exception occurs", async function() {
        let req = {
            body : {
                name : "",
                climate: "Climate",
                groundType: "Ground"
            }
        };

        let result = await controller.create(req, res);
        expect(res.send).toHaveBeenCalledWith(errorObject);
    });
});

describe("PlanetController - create - with generic error", function() {
    let service = jasmine.createSpyObj("service", ['add']);
    service.add.withArgs("", "Climate", "Ground").and.callFake(() => {throw new Error("message");});
    let controller = new PlanetController(service);
    let res = jasmine.createSpyObj("res", ['send', 'status']);
    res.status.withArgs(500).and.callFake(() => res);
    let errorObject = {
        statusCode : 500,
        message : "Internal server error."
    };
    res.send.withArgs(errorObject);

    it("should return specific error when exception occurs", async function() {
        let req = {
            body : {
                name : "",
                climate: "Climate",
                groundType: "Ground"
            }
        };

        let result = await controller.create(req, res);
        expect(res.send).toHaveBeenCalledWith(errorObject);
    });
});

describe("PlanetController - getAll", function() {
    let service = jasmine.createSpyObj("service", ['getAll']);
    let planet = new Planet("TestPlanet", "Climate", "Ground", 0);
    service.getAll.withArgs("TestPlanet", undefined, 20, 1).and.callFake(() => [planet]);
    let controller = new PlanetController(service);
    let res = jasmine.createSpyObj("res", ['send']);
    let req = jasmine.createSpyObj("req", ['param']);
    req.query = {name: "TestPlanet"};
    req.param.withArgs("pageSize", 10).and.callFake(() => "20");
    req.param.withArgs("pageNumber", 0).and.callFake(() => "1");
    res.send.withArgs([planet]);

    it("should return all planets according to query", async function() {
        let result = await controller.getAll(req, res);
        expect(res.send).toHaveBeenCalledWith([planet]);
    });
});

describe("PlanetController - getById", function() {
    let service = jasmine.createSpyObj("service", ['getById']);
    let planet = new Planet("TestPlanet", "Climate", "Ground", 0);
    service.getById.withArgs("Id").and.callFake(() => planet);
    let controller = new PlanetController(service);
    let res = jasmine.createSpyObj("res", ['send']);
    let req = jasmine.createSpyObj("req", ['param']);
    req.param.withArgs("id", "").and.callFake(() => "Id");
    res.send.withArgs(planet);

    it("should return planet according to id", async function() {
        let result = await controller.getById(req, res);
        expect(res.send).toHaveBeenCalledWith(planet);
    });
});

describe("PlanetController - getById - notFound", function() {
    let service = jasmine.createSpyObj("service", ['getById']);
    service.getById.withArgs("Id").and.callFake(() => {throw new PlanetNotFoundException("Not Found");});
    let controller = new PlanetController(service);
    let res = jasmine.createSpyObj("res", ['send', 'status']);
    let req = jasmine.createSpyObj("req", ['param']);
    req.param.withArgs("id", "").and.callFake(() => "Id");
    res.status.withArgs(404).and.callFake(() => res);
    let errorObject = {
        statusCode : 404,
        message : "Not found!"
    };

    res.send.withArgs(errorObject);

    it("should return 404 code", async function() {
        let result = await controller.getById(req, res);
        expect(res.send).toHaveBeenCalledWith(errorObject);
    });
});

describe("PlanetController - delete", function() {
    let service = jasmine.createSpyObj("service", ['delete']);
    service.delete.withArgs("Id");
    let controller = new PlanetController(service);
    let res = jasmine.createSpyObj("res", ['send']);
    let req = jasmine.createSpyObj("req", ['param']);
    req.param.withArgs("id").and.callFake(() => "Id");
    let errorObject = {
        statusCode : 200,
        message : "Deleted."
    };
    res.send.withArgs(errorObject);

    it("should delete planet according to id", async function() {
        await controller.delete(req, res);
        expect(res.send).toHaveBeenCalled();
        expect(service.delete).toHaveBeenCalledWith("Id");
    });
});

describe("PlanetController - delete - notFound", function() {
    let service = jasmine.createSpyObj("service", ['delete']);
    service.delete.withArgs("Id").and.callFake(() => {throw new PlanetNotFoundException("Not Found");});
    let controller = new PlanetController(service);
    let res = jasmine.createSpyObj("res", ['send', 'status']);
    let req = jasmine.createSpyObj("req", ['param']);
    req.param.withArgs("id").and.callFake(() => "Id");
    res.status.withArgs(404).and.callFake(() => res);
    let errorObject = {
        statusCode : 404,
        message : "Not found!"
    };
    res.send.withArgs(errorObject);

    it("should delete planet according to id", async function() {
        await controller.delete(req, res);
        expect(res.send).toHaveBeenCalledWith(errorObject);
    });
});
