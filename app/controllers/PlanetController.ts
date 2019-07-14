import { PlanetService } from '../services/PlanetService';
import { PlanetNotFoundException } from '../repositories/PlanetNotFoundException';
import { ArgumentNullException } from '../domain/ArgumentNullException';

export class PlanetController {
    _planetService : PlanetService;

    constructor(planetService : PlanetService){
        this._planetService = planetService;
    }

    async create(req : any, res : any){
        await this.execute(req, res, async () =>{
            let planet = await this._planetService.add(req.body.name, req.body.climate, req.body.groundType);

            res.send(planet);
        });
    }

    async getAll(req : any, res : any){
        await this.execute(req, res, async () =>{
            let pageSize = parseInt(req.param("pageSize", 10));
            let pageNumber = parseInt(req.param("pageNumber", 0));
            let name = req.query.name;
            let id = req.query.id;

            res.send(await this._planetService.getAll(name, id, pageSize, pageNumber))
        });
    }

    async getById(req : any, res : any){
        await this.execute(req, res, async () =>{
            let id = req.param("id", "");
            let planet = await this._planetService.getById(id);

            res.send(planet);
        });
    }

    async delete(req : any, res : any){
        await this.execute(req, res, async () =>{
            let id = req.param("id");
            await this._planetService.delete(id);

            res.send({statusCode: 200, message: "Deleted."});
        });
    }

    private async execute(req : any, res : any, callback : any){
        try{
            await callback();
        }
        catch(ex){
            if(ex instanceof PlanetNotFoundException)
                res.status(404).send({
                    statusCode : 404,
                    message : "Not found!"
                });
            else if(ex instanceof ArgumentNullException)
                res.status(400).send({
                    statusCode : 400,
                    message : ex._message
                });
            else
                res.status(500).send({
                    statusCode : 500,
                    message : "Internal server error."
                });
        }
    }
}