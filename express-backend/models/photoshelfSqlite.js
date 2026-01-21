import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import FeedbackUtils from '../utils/feedbackUtils.js';

export default class PhotoshelfSQLite {
    dir = undefined;
    filePath = undefined;
    database = undefined;
    err = undefined;
    isOpen = false;

    constructor(dir) {
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
            PRIMARY KEY("id" AUTOINCREMENT)
        );

        CREATE TABLE "photos" (
            "path"	TEXT NOT NULL UNIQUE,
            "capture_date"	DATETIME,
            "location_id"  INTEGER,
            PRIMARY KEY("path"),
            FOREIGN KEY("location_id") REFERENCES "locations"("id")
        );

        CREATE TABLE "albums_contents" (
            "album_id"	INTEGER NOT NULL,
            "type"	TEXT NOT NULL,
            "idx"	INTEGER NOT NULL,
            "photo_path"	TEXT,
            "title"	TEXT,
            FOREIGN KEY("photo_path") REFERENCES "photos"("path"),
            FOREIGN KEY("album_id") REFERENCES "albums"("id")
        );
    `;

    createIfNonExist() {
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
                .catch(err => reject(err));
        });
    }

    openDatabase() {
        return new Promise((resolve, reject) => {
            this.isOpen = true;
            this.database = new sqlite3.Database(this.filePath, (err) => {
                if (err) {
                    this.database.close();
                    return reject(err);
                }
            });
            
            resolve();
        });
    }

    closeDatabase() {
        if (this.isOpen) this.database.close();
        this.isOpen = false;
    }

    exec(statement) {
        return new Promise((resolve, reject) => {
            var r = this.openDatabase();
            if (r.err) return reject(r.err);
            this.database.exec(statement, (err) => {
                if (err) reject(err);
                else resolve();
            });
        })
    }

    all(statement, params) {
        return new Promise((resolve, reject) => {
            var r = this.openDatabase();
            if (r.err) return reject(r.err);
            this.database.all(statement, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        })
    }

    get(statement, params) {
        return new Promise((resolve, reject) => {
            this.database.get(statement, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        })
    }

    run(statement, params) {
        return new Promise((resolve, reject) => {
            this.database.run(statement, params, (err) => {
                if (err) reject(err);
                else resolve();
            });
        })
    }
}