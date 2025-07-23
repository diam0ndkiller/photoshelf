import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ConfigFileHelper from '../models/configFileHelper.js';

function getSecret() {
    return process.env.JWT_SECRET || "9283z4hoad89zhoöl23948uoöbnaöspov9783wpö4k023pghaöov9aw8u3ob4öllj";
}

export default class AuthenticationUtils {
    static isAuthenticated(req) {
        // SKIP FOR DEV
        return;

        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return {err: {message: 'No token provided.'}};
        }

        try {
            let username = jwt.verify(token, getSecret()).username;
            if (!username) return { err: { message: 'Invalid token.' } };
            return true;
        } catch (err) {
            return { err };
        }
    }

    static async login(username, password) {
        try {
            var r = ConfigFileHelper.getCredentials();
            if ('err' in r) return r;
            var credentials = r.credentials;

            if (!(username in credentials)) {
                return {err: {message: 'Invalid username.'}}
            }

            const result = await bcrypt.compare(password, credentials[username]);
            if (result) {
                const token = jwt.sign({ username }, getSecret(), { expiresIn: '10d' });
                return { token };
            } else {
                return { err: { message: 'Passwords do not match.' } };
            }
        } catch (err) {
            return {err}
        }
    }

    static async addUser(req, username, password) {
        var r = ConfigFileHelper.getCredentials();
        if ('err' in r) return r;
        var credentials = r.credentials;

        const isEmpty = Object.keys(credentials).length === 0;

        if (!isEmpty) {
            var isAuthenticated = this.isAuthenticated(req);
            if ('err' in isAuthenticated) return isAuthenticated;
        }

        try {
            const salt = await bcrypt.genSalt(10);
            const bcryptedPassword = await bcrypt.hash(password, salt);

            r = ConfigFileHelper.addUser(username, bcryptedPassword);
            if ('err' in credentials) return r;
        } catch (err) {
            return { err };
        }
    }
}
