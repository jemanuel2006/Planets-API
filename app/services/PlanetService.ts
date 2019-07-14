import { PlanetRepository } from '../repositories/PlanetRepository';
import { Planet } from '../domain/Planet';
import { HttpRequestService } from './HTTPRequestService';

export class PlanetService{
    _planetRepository : PlanetRepository;
    _httpRequestService : HttpRequestService;

    constructor(planetRepository : PlanetRepository, httpRequestService: HttpRequestService){
        this._planetRepository = planetRepository;
        this._httpRequestService = httpRequestService;
    }

    async add(name : String, climate:String, groundType : String){
        let result = await this._httpRequestService.get(`https://swapi.co/api/planets/?search=${name}`);
        let apparitions = 0;

        if(result && result.results && result.results.length > 0)
        {
            apparitions = result.results[0].films.length;
        }

        let planet = new Planet(name, climate, groundType, apparitions);

        await this._planetRepository.add(planet);

        return planet;
    }

    async getAll(name = "", id = "", pageSize = 10, pageNumber = 0){
        return await this._planetRepository.getAll(name, id, pageSize, pageNumber);
    }

    async getById(id : String){
        return await this._planetRepository.getById(id);
    }

    async delete(id : String){
        await this._planetRepository.delete(id);
    }
}