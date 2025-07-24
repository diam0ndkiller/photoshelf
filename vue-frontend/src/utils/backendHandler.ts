export default class BackendHandler {
    static TOKEN = '';
    static BASE_URL = import.meta.env.VITE_API_BASE_URL;

    static async fetchUrl(url: string, method: string = 'GET', body: object | undefined = undefined, auth: boolean = true, cache = "no-store") {
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
        return await this.fetchUrl(`${this.BASE_URL}/helloworld`);
    }

    static async listAlbums(): Promise<{albums: Array<{id: number, name: string}>}> {
        return await this.fetchUrl(`${this.BASE_URL}/albums/list-albums`);
    }

    static async listAllPhotos(): Promise<{photos: Array<{path: string, capture_date: string}>}> {
        return await this.fetchUrl(`${this.BASE_URL}/photos/list-all-photos`);
    }
}