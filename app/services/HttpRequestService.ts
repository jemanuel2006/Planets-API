import request from 'request-promise-native';

export class HttpRequestService{

    async get(url : string){
        return JSON.parse(await request.get(url));
    }
}