import FilesystemPhotoHelper from "../models/filesystemPhotoHelper.js";
import PhotoshelfSQLite from "../models/photoshelfSqlite.js";
import ConfigFileHelper from '../models/configFileHelper.js';
import { AlbumType, PhotoLocationType, PhotoType } from "@shared/types.js";

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

    static async firstTimeInitDatabase(fileLocation: string) {
        var setDatabaseLocationResult = ConfigFileHelper.setDatabaseLocation(fileLocation);
        if ('err' in setDatabaseLocationResult) return setDatabaseLocationResult;

        var r = await this.initializeDatabase();
        if ('err' in r) return r;
        r.database.closeDatabase();
        return r;
    }

    static async listAlbums() {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var albums;

        try { albums = await database.all<AlbumType>("SELECT * from 'albums' ORDER BY name ASC;", []); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { albums }
    }

    static async createAlbum(name: string) {
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

    static async deleteAlbum(id: string) {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        try {
            var res = await database.run("DELETE FROM albums WHERE id = ?;", [id]);
            return { success: true };
        } catch (err) { return { err } }
        finally { database.closeDatabase(); }
    }

    static async getAlbumInformation(id: string) {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var album;

        try { album = await database.get<AlbumType>("SELECT * from 'albums' WHERE id = ?;", [id]); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { album }
    }

    static async listAllPhotos() {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var photos;

        try { photos = await database.all<PhotoType>("SELECT photos.*, locations.path AS location_path from photos JOIN locations ON photos.location_id = locations.id ORDER BY path ASC;", []); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { photos }
    }

    static async scanPhotos(dir: string, location_id: number, forceRescan: boolean) {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var res = await FilesystemPhotoHelper.scanPhotos(database, dir, location_id, forceRescan);

        database.closeDatabase();

        return res;
    }

    static async rescanPhotos(forceRescan: boolean) {
        var r = await this.initializeDatabase();
        if('err' in r) return { err: r.err }
        var database = r.database

        var rows = await database.all<PhotoLocationType>("SELECT * FROM locations", []);
        if ('err' in rows) return rows;

        var res;

        for (var i = 0; i < rows.length; i++) {
            res = await this.scanPhotos(rows[i].path, rows[i].id, forceRescan);
            if ('err' in res) return res;
        }

        database.closeDatabase();

        return {}
    }

    static async addPhotoToAlbum(photoId: string, albumId: string) {
        var r = await this.initializeDatabase();
        if ('err' in r) return {err: r.err }
        var database = r.database;

        // TODO:
    }

    static async getPhotoLocations() {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var photoLocations;

        try { photoLocations = await database.all<PhotoLocationType>("SELECT * from 'locations' ORDER BY path ASC;", []); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { photoLocations }
    }

    static async addPhotoLocation(locationToAdd: string) {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        try { await database.run("INSERT INTO 'locations' (path) VALUES (?)", [locationToAdd]); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { success: true }
    }

    static async deletePhotoLocation(id: string) {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        try { await database.run("DELETE FROM 'locations' WHERE id = ?", [id]); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { success: true }
    }
}