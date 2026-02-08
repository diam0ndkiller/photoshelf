import fs from 'fs';

const DEFAULT_CONFIG = {
    databaseLocation: "",
    credentials: {}
}

export default class ConfigFileHelper {
    static readConfig() {
        var config = DEFAULT_CONFIG;

        try { config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8')); }
        catch (err) { return this.writeConfig(config); }

        return { config };
    }

    static writeConfig(config) {
        try { fs.writeFileSync('./config/config.json', JSON.stringify(config)); }
        catch (err) { return { err }; }

        return { config };
    }

    static getDatabaseLocation() {
        var r = this.readConfig();
        if ('err' in r) return r;
        else return {databaseLocation: r.config.databaseLocation};
    }

    static setDatabaseLocation(dir) {
        var r = this.readConfig();
        if ('err' in r) return r;

        var config = r.config;
        config.databaseLocation = dir;

        return this.writeConfig(config);
    }

    static getCredentials() {
        var r = this.readConfig();
        if ('err' in r) return r;
        else return {credentials: r.config.credentials};
    }

    static addUser(username, bcryptedPassword) {
        var r = this.readConfig();
        if ('err' in r) return r;

        var config = r.config;
        config.credentials[username] = bcryptedPassword;

        console.log(username, bcryptedPassword);
        console.log(config);

        return this.writeConfig(config);
    }
}