import { ArgumentNullException } from "./ArgumentNullException";

export class Planet{
    _id: any;
    Name :  String;
    Climate : String;
    GroundType : String;
    Apparitions : number;
    
    constructor(name: String, climate: String, groundType: String, apparitions: number){
        if(!name || name == "")
            throw new ArgumentNullException("Parameter 'name' is empty.");

        if(!climate || climate == "")
            throw new ArgumentNullException("Parameter 'climate' is empty.");

        if(!groundType || groundType == "")
            throw new ArgumentNullException("Parameter 'ground' is empty.");

        this._id = 0;
        this.Name = name;
        this.Climate = climate;
        this.GroundType = groundType;
        this.Apparitions = apparitions;
    }
}