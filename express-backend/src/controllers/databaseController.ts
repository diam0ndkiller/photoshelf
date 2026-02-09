import FilesystemPhotoHelper from "../models/filesystemPhotoHelper.js";
import PhotoshelfSQLite from "../models/photoshelfSqlite.js";
import ConfigFileHelper from '../models/configFileHelper.js';
import { Album, PhotoLocation, Photo, AlbumContentLink, JoinedAlbumContentLink } from "@shared/databasetypes.js";
import { ErrorResultObject, TrueSuccessObject } from "@shared/types.js";

export default class DatabaseController {
    static async initializeDatabase(): Promise<ErrorResultObject | {database: PhotoshelfSQLite}> {
        var r = ConfigFileHelper.getDatabaseLocation();
        if ('err' in r) return r;
        if (r.databaseLocation == '') return {err: {message: 'No database location set.'}}
        var database = new PhotoshelfSQLite(r.databaseLocation);
        try { await database.createIfNonExist() }
        catch (err) { return { err } }
        database.openDatabase();
        return { database }
    }

    static async firstTimeInitDatabase(fileLocation: string): Promise<ErrorResultObject | {database: PhotoshelfSQLite}> {
        var setDatabaseLocationResult = ConfigFileHelper.setDatabaseLocation(fileLocation);
        if ('err' in setDatabaseLocationResult) return setDatabaseLocationResult;

        var r = await this.initializeDatabase();
        if ('err' in r) return r;
        r.database.closeDatabase();
        return r;
    }

    static async listAlbums(): Promise<ErrorResultObject | {albums: Array<Album>}> {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var albums;

        try { albums = await database.all<Album>("SELECT * from 'albums' ORDER BY name ASC;", []); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { albums }
    }

    static async createAlbum(name: string): Promise<ErrorResultObject | TrueSuccessObject> {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        try {
            var exists = await database.get("SELECT * from 'albums' WHERE name = ?;", [name]);
            if (exists) return {err: {message: `Album ${name} already exists.`}};

            var res = await database.run("INSERT INTO albums (name, background_color) VALUES (?, ?);", [name, ConfigFileHelper.getDefaultBackgroundColor().defaultBackgroundColor]);

            return {success: true};
        } catch (err) { return { err } }
        finally { database.closeDatabase(); }
    }

    static async deleteAlbum(id: number): Promise<ErrorResultObject | TrueSuccessObject> {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        try {
            var res = await database.run("DELETE FROM albums WHERE id = ?;", [id]);
            return { success: true };
        } catch (err) { return { err } }
        finally { database.closeDatabase(); }
    }

    static async getAlbumInformation(id: string): Promise<ErrorResultObject | {album: Album}> {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var album: Album;

        try { album = await database.get<Album>("SELECT * from 'albums' WHERE id = ?;", [id]); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { album }
    }

    static async listAllPhotos(): Promise<ErrorResultObject | {photos: Array<Photo>}> {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var photos: Array<Photo>;

        try { photos = await database.all<Photo>("SELECT photos.*, locations.path AS location_path from photos JOIN locations ON photos.location_id = locations.id ORDER BY path ASC;", []); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { photos }
    }

    static async scanPhotos(dir: string, location_id: number, forceRescan: boolean): Promise<ErrorResultObject | TrueSuccessObject> {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var res = await FilesystemPhotoHelper.scanPhotos(database, dir, location_id, forceRescan);

        database.closeDatabase();

        return res;
    }

    static async rescanPhotos(forceRescan: boolean): Promise<ErrorResultObject | TrueSuccessObject> {
        var r = await this.initializeDatabase();
        if('err' in r) return { err: r.err }
        var database = r.database

        try {
            var rows = await database.all<PhotoLocation>("SELECT * FROM locations", []);
            var res: ErrorResultObject | TrueSuccessObject;

            for (var i = 0; i < rows.length; i++) {
                res = await this.scanPhotos(rows[i].path, rows[i].id, forceRescan);
                if ('err' in res) return res;
            }
        }
        catch (err) { return {err} }
        finally { database.closeDatabase() };

        return {success: true}
    }

    static async addPhotoToAlbum(photoId: number, albumId: number): Promise<ErrorResultObject | TrueSuccessObject> {
        var r = await this.initializeDatabase();
        if ('err' in r) return {err: r.err }
        var database = r.database;

        try {
            database.run(`  INSERT INTO "albums_contents" ("album_id", "index", "type", "photo_id", "title")
                            VALUES (
                                ?,
                                COALESCE(
                                    (SELECT MAX("index") + 1 FROM "albums_contents" WHERE "album_id" = ?), 0
                                ),
                                "photo",
                                ?,
                                ""
                            );`, [albumId, albumId, photoId]);
        }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return {success: true}
    }

    static async getAlbumContents(id: string): Promise<ErrorResultObject | {contents: Array<JoinedAlbumContentLink>}> {
        var r = await this.initializeDatabase();
        if ('err' in r) return {err: r.err }
        var database = r.database;

        var rows: Array<JoinedAlbumContentLink>;

        try {
            rows = await database.all<JoinedAlbumContentLink>(`SELECT "albums_contents".*, "photos"."path" as "photo_path", "photos"."capture_date" as "photo_capture_date"
                                    FROM "albums_contents" JOIN "photos" ON "albums_contents"."photo_id" = "photos"."id"
                                    WHERE "album_id" = ? ORDER BY "albums_contents"."index" ASC;`, [id])
        }
        catch (err) { return {err} }
        finally { database.closeDatabase(); }

        return {contents: rows}
    }

    static async getPhotoLocations(): Promise<ErrorResultObject | {photoLocations: Array<PhotoLocation>}> {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        var photoLocations: Array<PhotoLocation>;

        try { photoLocations = await database.all<PhotoLocation>("SELECT * from 'locations' ORDER BY path ASC;", []); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { photoLocations }
    }

    static async addPhotoLocation(locationToAdd: string): Promise<ErrorResultObject | TrueSuccessObject> {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        try { await database.run("INSERT INTO 'locations' (path) VALUES (?)", [locationToAdd]); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { success: true }
    }

    static async deletePhotoLocation(id: string): Promise<ErrorResultObject | TrueSuccessObject> {
        var r = await this.initializeDatabase();
        if ('err' in r) return { err: r.err }
        var database = r.database;

        try { await database.run("DELETE FROM 'locations' WHERE id = ?", [id]); }
        catch (err) { return { err } }
        finally { database.closeDatabase(); }

        return { success: true }
    }
}