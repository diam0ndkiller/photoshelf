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
        database.openDatabase();
        return { database }
    }

    static async firstTimeInitDatabase(fileLocation) {
        var r = ConfigFileHelper.setDatabaseLocation(fileLocation);
        if ('err' in r) return r;

        r = await this.initializeDatabase();
        if ('err' in r) return r;
        r.database.closeDatabase();
        return r;
    }

    static async listAlbums() {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var albums;

        try { albums = await database.all("SELECT * from 'albums' ORDER BY name ASC;", []); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { albums }
    }

    static async listAllPhotos() {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var photos;

        try { photos = await database.all("SELECT * from 'photos';", []); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { photos }
    }

    static async scanPhotos(dir, forceRescan) {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var res = await FilesystemPhotoHelper.scanPhotos(database, dir, forceRescan);

        databse.closeDatabase();

        return res;
    }

    static async rescanAllPhotos() {
        var r = await this.initializeDatabase();
        if('err' in r) return { err: r.err }
        var database = r.database

        var rows = await database.all("SELECT (path) FROM locations", []);

        rows.forEach(element => {
            this.scanPhotos(element.path, true);
        });

        database.closeDatabase();

        return {}
    }

    static async getPhotoLocations() {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var photoLocations;

        try { photoLocations = await database.all("SELECT * from 'locations' ORDER BY path ASC;", []); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { photoLocations }
    }

    static async addPhotoLocation(locationToAdd) {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        try { await database.run("INSERT INTO 'locations' (path) VALUES (?)", [locationToAdd]); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { success: true }
    }

    static async deletePhotoLocation(id) {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        try { await database.run("DELETE FROM 'locations' WHERE id = ?", [id]); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { success: true }
    }
}