import cjson from 'cjson';
import fs from 'fs';
import Logging from './Logging.js';

export default class Config {
    // Static variable to hold the single instance (private with # in modern JS)
    static instance = null;
    _config = null;
    static prefixMessage = "";

    constructor() {
        this.prefixMessage = "class Config";
        if (Config.instance) {
            throw new Error('Use Config.getInstance() to get the singleton instance.');
        }
    }

    logError(prefixMessage, err) {
        let typeofErr = typeof err;
        let errorMessage = "";
        if (typeofErr == "string") {
            errorMessage = err;
        } else {
            errorMessage = err.message;
        }
        Logging.getInstance().error(`${prefixMessage} ${errorMessage}`);
        throw (err);
    }

    static async getInstance() {
        let prefix = `class Config function getInstance`;
        Logging.getInstance().debug(`${prefix} start `);
        try {
            if (this.instance === null) {
                this.instance = new Config();
            }
            if (this._config) {
                this._config = await this.instance.readConfig();
            }
        } catch (error) {
            this.logError(prefix, error);
        }
        Logging.getInstance().debug(`${prefix} stop`);
        return this.instance;
    }

    async readConfig() {
        let prefix = `${this.prefixMessage} function readConfig`;
        Logging.getInstance().debug(`${prefix} start `);

        try {
            let configDirPath = "/app/config";
            if (!fs.existsSync(configDirPath)) {
                throw `la cartella ${configDirPath} non esiste `;
            }
            let configFilePath = `${configDirPath}/config.json`;
            if (!fs.existsSync(configFilePath)) {
                throw `la cartella ${configFilePath} non esiste `;
            }
            var config = cjson.load(configFilePath);
            if (!config) {
                throw ` config vuota `;                
            }
            this._config = config;
        } catch (error) {
            this.logError(prefix, error);
        }
        Logging.getInstance().debug(`${prefix} stop`);
    }

    get config() {
        return this._config;
    }

}

