async function getUrl(url: string) {
    const res = await fetch(url);
    return await res.json();
}


export default class BackendHandler {
    static BASE_URL = import.meta.env.VITE_API_BASE_URL

    static async getHelloworld() {
        return await getUrl(`${this.BASE_URL}/helloworld`);
    }

    static async listAlbums(): Promise<{albums: Array<{id: number, name: string}>}> {
        return await getUrl(`${this.BASE_URL}/albums/list-albums`);
    }

    static async listAllPhotos(): Promise<{photos: Array<{path: string, capture_date: string}>}> {
        return await getUrl(`${this.BASE_URL}/photos/list-all-photos`);
    }
}