import fs from 'fs';
import path from 'path';
import { exiftool } from 'exiftool-vendored';
import PhotoshelfSQLite from './photoshelfSqlite.js';
import { ErrorResultObject, TrueSuccessObject } from '@shared/types.js';

export default class FilesystemPhotoHelper {
    static async scanPhotos(photoshelfSqlite: PhotoshelfSQLite, dir: string, location_id: number, forceRescan: boolean): Promise<ErrorResultObject | TrueSuccessObject> {
        try {
            const allFiles = await this.walkDir(dir);

            const imageFiles = allFiles.filter(this.isImageFile);

            photoshelfSqlite.openDatabase();

            for (const filePath of imageFiles) {

                const exists = await photoshelfSqlite.get('SELECT * FROM photos WHERE path = ?', [filePath]);

                if (exists) {
                    if (forceRescan) {
                        await photoshelfSqlite.run('DELETE FROM photos WHERE path = ?', [filePath]);
                    } else continue;
                }

                let captureDate = null;
                try {
                    const metadata = await exiftool.read(filePath);
                    captureDate =
                    metadata.DateTimeOriginal ||
                    metadata.CreateDate ||
                    metadata.ModifyDate ||
                    null;
                } catch (exifErr) {
                    // Unable to read metadata, fallback to fs mtime below
                }

                // Fallback: file system modified time if no capture date
                if (!captureDate) {
                    const stats = await fs.promises.stat(filePath);
                    captureDate = String(stats.mtime);
                }

                // Normalize captureDate to ISO string (SQLite DATETIME format)
                var captureDateISO = "";

                if (captureDate && typeof captureDate.toIsoString === 'function') {
                    captureDateISO = captureDate.toISOString();
                } else {
                    captureDateISO = String(captureDate);
                }
                // Insert into DB
                await photoshelfSqlite.run('INSERT INTO photos (path, capture_date, location_id) VALUES (?, ?, ?)', [
                    filePath,
                    captureDateISO,
                    location_id
                ]);
            }
        } catch (err) {
            return { err }
        } finally {
            photoshelfSqlite.closeDatabase();
            await exiftool.end(); // important to close exiftool process when done
        }
        return { success: true }
    }

    static async walkDir(currentPath: string) {
        const entries = await fs.promises.readdir(currentPath, { withFileTypes: true });
        let files = [];

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                const subFiles = await this.walkDir(fullPath);
                files = files.concat(subFiles);
            } else if (entry.isFile()) {
                files.push(fullPath);
            }
        }
        return files;
    }

    static isImageFile(filepath: string) {
        const ext = path.extname(filepath).toLowerCase();
        const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.heic', '.tiff', '.webp'];
        return imageExts.includes(ext);
    }
}