import FilesystemPhotoHelper from "../models/filesystemPhotoHelper.js";
import PhotoshelfSQLite from "../models/photoshelfSqlite.js";

export default class DatabaseController {
    static async initializeDatabase(fileLocation) {
        var database = new PhotoshelfSQLite(fileLocation);
        try { await database.createIfNonExist() }
        catch (err) { return { err } }
        return { database }
    }

    static async listAlbums() {
        var r = await this.initializeDatabase("/media/diam0ndkiller/MEDIA/documents/code/photoshelf"); // TODO: config file
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var albums;

        try { albums = await database.all("SELECT * from 'albums' ORDER BY name ASC;", []); }
        catch (err) { return { err } }

        return { albums }
    }

    static async listAllPhotos() {
        var r = await this.initializeDatabase("/media/diam0ndkiller/MEDIA/documents/code/photoshelf"); // TODO: config file
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var photos;

        try { photos = await database.all("SELECT * from 'photos';", []); }
        catch (err) { return { err } }

        return { photos }
    }

    static async scanPhotos(dir, forceRescan) {
        var r = await this.initializeDatabase("/media/diam0ndkiller/MEDIA/documents/code/photoshelf"); // TODO: config file
        if ('err' in r) return { err: r.err }
        var database = r.database;

        return await FilesystemPhotoHelper.scanPhotos(database, dir, forceRescan);
    }
}