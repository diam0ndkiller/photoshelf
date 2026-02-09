import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { ErrorResultObject, TrueSuccessObject } from '@shared/types.js';

export default class PhotoshelfSQLite {
    dir = undefined;
    filePath = undefined;
    database: sqlite3.Database = undefined;
    err = undefined;
    isOpen = false;

    constructor(dir: string) {
        this.dir = dir;
        this.filePath = path.join(dir, 'photoshelf.sqlite');
    }

    CREATE_TABLES_STATEMENT = `
        CREATE TABLE "locations" (
            "id"    INTEGER NOT NULL UNIQUE,
            "path"  TEXT NOT NULL,
            PRIMARY KEY("id" AUTOINCREMENT)
        );
        
        CREATE TABLE "albums" (
            "id"	INTEGER NOT NULL UNIQUE,
            "name"	TEXT,
            "background_color"  TEXT,
            PRIMARY KEY("id" AUTOINCREMENT)
        );

        CREATE TABLE "photos" (
            "id"    INTEGER NOT NULL UNIQUE,
            "path"	TEXT NOT NULL UNIQUE,
            "capture_date"	DATETIME,
            "location_id"  INTEGER,
            PRIMARY KEY("id"),
            FOREIGN KEY("location_id") REFERENCES "locations"("id")
        );

        CREATE TABLE "albums_contents" (
            "album_id"	INTEGER NOT NULL,
            "index"	INTEGER NOT NULL,
            "type"	TEXT NOT NULL,
            "photo_id"	INTEGER,
            "title"	TEXT,
            FOREIGN KEY("photo_id") REFERENCES "photos"("id"),
            FOREIGN KEY("album_id") REFERENCES "albums"("id"),
            UNIQUE ("album_id", "index")
        );
    `;

    createIfNonExist(): Promise<ErrorResultObject | void> {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(this.dir)) {
                fs.mkdirSync(this.dir, { recursive: true });
            }

            if (fs.existsSync(this.filePath)) return resolve();

            this.database = new sqlite3.Database(this.filePath, (err) => {
                this.database.close();
                if (err) return reject(err);
            });

            this.openDatabase();
            this.exec(this.CREATE_TABLES_STATEMENT)
                .then(() => resolve())
                .catch(err => reject({err}));
        });
    }

    openDatabase(): Promise<ErrorResultObject | TrueSuccessObject> {
        return new Promise((resolve, reject) => {
            this.isOpen = true;
            this.database = new sqlite3.Database(this.filePath, (err) => {
                if (err) {
                    this.database.close();
                    return reject({err});
                }
            });
            
            resolve({success: true});
        });
    }

    closeDatabase(): void {
        if (this.isOpen) this.database.close();
        this.isOpen = false;
    }

    exec(statement: string): Promise<TrueSuccessObject> {
        return new Promise((resolve, reject) => {
            var r = this.openDatabase();
            if ('err' in r) return reject(r.err);
            this.database.exec(statement, (err) => {
                if (err) reject(err);
                else resolve({success: true});
            });
        })
    }

    all<T>(statement: string, params?: Array<any>): Promise<Array<T>> {
        return new Promise((resolve, reject) => {
            var r = this.openDatabase();
            if ('err' in r) return reject(r.err);
            this.database.all(statement, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows as Array<T>);
            });
        })
    }

    get<T>(statement: string, params?: Array<any>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.database.get(statement, params, (err, row) => {
                if (err) reject(err);
                else resolve(row as T);
            });
        })
    }

    run(statement: string, params?: Array<any>): Promise<TrueSuccessObject> {
        return new Promise((resolve, reject) => {
            this.database.run(statement, params, (err) => {
                if (err) reject(err);
                else resolve({success: true});
            });
        })
    }
}