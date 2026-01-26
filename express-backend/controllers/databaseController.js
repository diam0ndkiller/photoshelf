import FilesystemPhotoHelper from "../models/filesystemPhotoHelper.js";
import PhotoshelfSQLite from "../models/photoshelfSqlite.js";
import ConfigFileHelper from '../models/configFileHelper.js';

export default class DatabaseController {
    static async initializeDatabase() {
        var r = ConfigFileHelper.getDatabaseLocation();
        if ('err' in r) return r;
        if (r.databaseLocation == '') return {err: {message: 'No database location set.'}}
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

    static async createAlbum(name) {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        try {
            var exists = await database.get("SELECT * from 'albums' WHERE name = ?;", [name]);
            if (exists) return {err: {message: `Album ${name} already exists.`}};

            var res = await database.run("INSERT INTO albums (name) VALUES (?);", [name]);

            return {success: true};
        } catch (err) { return { err } }
        finally { database.closeDatabase(); }
    }

    static async getAlbumInformation(id) {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var album;

        try { album = await database.get("SELECT * from 'albums' WHERE id = ?;", [id]); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { album }
    }

    static async listAllPhotos() {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var photos;

        try { photos = await database.all("SELECT photos.*, locations.path AS location_path from photos JOIN locations ON photos.location_id = locations.id ORDER BY path ASC;", []); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { photos }
    }

    static async scanPhotos(dir, location_id, forceRescan) {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var res = await FilesystemPhotoHelper.scanPhotos(database, dir, location_id, forceRescan);

        database.closeDatabase();

        return res;
    }

    static async rescanPhotos(forceRescan) {
        var r = await this.initializeDatabase();
        if('err' in r) return { err: r.err }
        var database = r.database

        var rows = await database.all("SELECT * FROM locations", []);

        var res;

        for (var i = 0; i < rows.length; i++) {
            res = await this.scanPhotos(rows[i].path, rows[i].id, forceRescan);
            if ('err' in res) return res;
        }

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