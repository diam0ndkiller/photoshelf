import { BackendConfig, BackendConfigCredentials, ErrorResultObject } from '@shared/types.js';
import fs from 'fs';

const DEFAULT_CONFIG: BackendConfig = {
    databaseLocation: "",
    credentials: {}
}

export default class ConfigFileHelper {
    

    static readConfig(): ErrorResultObject | {config: BackendConfig} {
        var config = DEFAULT_CONFIG;

        try { config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8')); }
        catch (err) { return this.writeConfig(config); }

        return { config };
    }

    static writeConfig(config): ErrorResultObject | {config: BackendConfig} {
        try { fs.writeFileSync('./config/config.json', JSON.stringify(config)); }
        catch (err) { return { err }; }

        return { config };
    }

    static getDatabaseLocation(): ErrorResultObject | {databaseLocation: string} {
        var r = this.readConfig();
        if ('err' in r) return r;
        else return {databaseLocation: r.config.databaseLocation};
    }

    static setDatabaseLocation(dir: string): ErrorResultObject | {config: BackendConfig} {
        var r = this.readConfig();
        if ('err' in r) return r;

        var config = r.config;
        config.databaseLocation = dir;

        return this.writeConfig(config);
    }

    static getCredentials(): ErrorResultObject | {credentials: BackendConfigCredentials} {
        var r = this.readConfig();
        if ('err' in r) return r;
        else return {credentials: r.config.credentials};
    }

    static addUser(username: string, bcryptedPassword: string): ErrorResultObject | {config: BackendConfig} {
        var r = this.readConfig();
        if ('err' in r) return r;

        var config = r.config;
        config.credentials[username] = bcryptedPassword;

        console.log(username, bcryptedPassword);
        console.log(config);

        return this.writeConfig(config);
    }
}