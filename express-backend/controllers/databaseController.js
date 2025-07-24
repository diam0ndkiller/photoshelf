import FilesystemPhotoHelper from "../models/filesystemPhotoHelper.js";
import PhotoshelfSQLite from "../models/photoshelfSqlite.js";
import ConfigFileHelper from '../models/configFileHelper.js';

export default class DatabaseController {
    static async initializeDatabase() {
        var r = ConfigFileHelper.getDatabaseLocation();
        if ('err' in r) return r;
        if (r.databaseLocation == '') return {err: {message: 'No database location set.'}}
        console.log(r.databaseLocation);
        var database = new PhotoshelfSQLite(r.databaseLocation);
        try { await database.createIfNonExist() }
        catch (err) { return { err } }
        return { database }
    }

    static async firstTimeInitDatabase(fileLocation) {
        var r = ConfigFileHelper.setDatabaseLocation(fileLocation);
        if ('err' in r) return r;

        return await this.initializeDatabase();
    }

    static async listAlbums() {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var albums;

        try { albums = await database.all("SELECT * from 'albums' ORDER BY name ASC;", []); }
        catch (err) { return { err } }

        return { albums }
    }

    static async listAllPhotos() {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var photos;

        try { photos = await database.all("SELECT * from 'photos';", []); }
        catch (err) { return { err } }

        return { photos }
    }

    static async scanPhotos(dir, forceRescan) {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        return await FilesystemPhotoHelper.scanPhotos(database, dir, forceRescan);
    }
}