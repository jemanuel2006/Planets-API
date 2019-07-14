export class DatabaseConfig {
    ConnString: string;
    MainCollection: string;

    constructor(database: string, mainCollection: string){
        this.ConnString = database;
        this.MainCollection = mainCollection;
    }
}