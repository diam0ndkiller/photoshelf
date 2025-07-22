import fs from 'fs';
import path from 'path';
import { exiftool } from 'exiftool-vendored';

export default class FilesystemPhotoHelper {
    static async scanPhotos(photoshelfSqlite, dir, forceRescan) {
        try {
            const allFiles = await this.walkDir(dir);

            const imageFiles = allFiles.filter(this.isImageFile);

            photoshelfSqlite.openDatabase();

            for (const filePath of imageFiles) {

                const exists = await photoshelfSqlite.get('SELECT 1 FROM photos WHERE path = ?', [filePath]);
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
                    captureDate = stats.mtime;
                }

                // Normalize captureDate to ISO string (SQLite DATETIME format)
                const captureDateISO = captureDate instanceof Date ? captureDate.toISOString() : captureDate;

                // Insert into DB
                await photoshelfSqlite.run('INSERT INTO photos (path, capture_date) VALUES (?, ?)', [
                    filePath,
                    captureDateISO,
                ]);
            }
        } catch (err) {
            return { err }
        } finally {
            photoshelfSqlite.closeDatabase();
            await exiftool.end(); // important to close exiftool process when done
        }
        return { message: 'success' }
    }

    static async walkDir(currentPath) {
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

    static isImageFile(filepath) {
        const ext = path.extname(filepath).toLowerCase();
        const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.heic', '.tiff', '.webp'];
        return imageExts.includes(ext);
    }
}