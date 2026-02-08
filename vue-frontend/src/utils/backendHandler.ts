import { Logger } from "./logger";

import type {Album as AlbumType, Photo as PhotoType} from '@shared/databasetypes';
import type {ErrorResultObject, SuccessObject} from '@shared/types';

export class BackendHandler {
    static TOKEN = '';
    static BASE_URL = import.meta.env.VITE_API_BASE_URL;

    static async fetchUrl(url: string, method: string = 'GET', body: object | undefined = undefined, auth: boolean = true, cache = "no-store") {
        Logger.info(`Fetching ${url} ${method}`);
        var obj: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
        }
        if (auth) obj.headers['Authorization'] = `Bearer ${this.TOKEN}`
        if (body) {
            let jsonBody = JSON.stringify(body);
            obj['body'] = jsonBody;
        }
        if (cache) obj.cache = cache;
        const res = await fetch(url, obj);
        return await res.json();
    }

    static getToken() {
        if (this.TOKEN) return this.TOKEN;
        else return false;
    }

    static async getDatabaseLocation() {
        return await this.fetchUrl(this.BASE_URL+'/db-actions/get-db-location', 'GET');
    }

    static async getDefaultDatabaseLocation() {
        return await this.fetchUrl(this.BASE_URL+'/db-actions/get-default-db-location', 'GET');
    }

    static async saveDatabaseLocation(databaseLocation: string) {
        return await this.fetchUrl(this.BASE_URL+'/db-actions/init-db', 'POST', {databaseLocation}, true);
    }

    static async login(username: string, password: string) {
        const r = await this.fetchUrl(this.BASE_URL+'/users/login', 'POST', { username, password }, false);
        if ('err' in r) return r;

        this.TOKEN = r.token;
        
        return r;
    }

    static async addUser(username: string, password: string) {
        return await this.fetchUrl(this.BASE_URL+'/users/add-user', 'POST', { username, password }, false);
    }

    static async getHelloworld() {
        return await this.fetchUrl(`${this.BASE_URL}/helloworld`, 'GET');
    }

    static async listAlbums(): Promise<{albums: Array<AlbumType>}> {
        return await this.fetchUrl(`${this.BASE_URL}/albums/list-albums`, 'GET');
    }

    static async createAlbum(name: String) {
        return await this.fetchUrl(`${this.BASE_URL}/albums/create-album`, 'POST', {name})
    }

    static async deleteAlbum(id: Number) {
        return await this.fetchUrl(`${this.BASE_URL}/albums/delete-album`, 'POST', {id})
    }

    static async getAlbumInformation(albumId: Number): Promise<{album: AlbumType}> {
        return await this.fetchUrl(`${this.BASE_URL}/albums/album-information?id=${albumId}`, 'GET');        
    }

    static async listAllPhotos(): Promise<{photos: Array<PhotoType>}> {
        return await this.fetchUrl(`${this.BASE_URL}/photos/list-all-photos`, 'GET');
    }

    static async rescanAllPhotos() {
        return await this.fetchUrl(this.BASE_URL+'/photos/rescan-all-photos', 'POST')
    }

    static async scanNewPhotos() {
        return await this.fetchUrl(this.BASE_URL+'/photos/scan-new-photos', 'POST')
    }

    static async addPhotoToAlbum(photoId: number, albumId: number): Promise<ErrorResultObject | SuccessObject> {
        return await this.fetchUrl(this.BASE_URL+'/albums/add-to-album', 'POST', {photoId, albumId})
    }

    static async getPhotoLocations() {
        return await this.fetchUrl(this.BASE_URL+'/photos/get-photo-locations', 'GET');
    }

    static async addPhotoLocation(locationToAdd: string) {
        return await this.fetchUrl(this.BASE_URL+'/photos/add-photo-location', 'POST', {locationToAdd})
    }

    static async deletePhotoLocation(id: number) {
        return await this.fetchUrl(this.BASE_URL+'/photos/delete-photo-location', 'POST', {id})
    }
}