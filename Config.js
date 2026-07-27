import cjson, { load } from 'cjson';
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

    static getInstance() {
        let prefix = `class Config function getInstance`;
        Logging.getInstance().debug(`${prefix} start `);
        try {
            if (this.instance === null) {
                this.instance = new Config();
            }
            //if (this._config) {
            //    this._config = await this.instance.readConfig();
            //}
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

    getRepositoryConnenction() {
        let prefix = `${this.prefixMessage} function getRepositoryConnenction`;
        Logging.getInstance().debug(`${prefix} start `);
        let configConnection = null;
        try {
            if (!this._config) {
                throw `configurazione non impostata `;
            }
            if (!"repository" in this._config || !this._config.repository) {
                throw `repository non configurato `;
            }
            let repository = this._config.repository;
            if (!"database" in repository || !repository.database) {
                throw `repository database non configurato `;
            }
            let database = repository.database;
            if (!"connection" in database || !database.connection) {
                throw `repository database connection non configurato `;
            }
            let connection = database.connection;
            if (!"username" in connection || !connection.username) {
                throw `repository database connection username non configurato `;
            }
            if (!"password" in connection || !connection.password) {
                throw `repository database connection password non configurato `;
            }
            if (!"hostname" in connection || !connection.hostname) {
                throw `repository database connection hostname non configurato `;
            }
            if (!"database" in connection || !connection.database) {
                throw `repository database connection database non configurato `;
            }
            if (!"dialect" in connection || !connection.dialect) {
                throw `repository database connection dialect non configurato `;
            }
            if (!"testSqlStatement" in connection || !connection.testSqlStatement) {
                throw `repository database connection testSqlStatement non configurato `;
            }
            configConnection = this._config.repository.database.connection;
        } catch (error) {
            this.logError(prefix, error);
        }
        Logging.getInstance().debug(`${prefix} stop`);
        return configConnection;
    }

    getLoadModulesConfig() {
        let prefix = `${this.prefixMessage} function getLoadModulesConfig`;
        Logging.getInstance().debug(`${prefix} start `);
        let loadModulesConfig = null;
        try {
            if (!this._config) {
                throw `configurazione non impostata `;
            }
            if ("modules" in this._config && 
                this._config.modules !== undefined &&
                this._config.modules !== null) {
                    Logging.getInstance().debug(`${prefix} modules configuration found `);
                    loadModulesConfig = this._config
                    let modules = this._config.modules;
                    if ("models" in modules && 
                        modules.models !== undefined &&
                        modules.models !== null
                    ) {
                        Logging.getInstance().debug(`${prefix} models configuration found `);
                        let models = modules.models;
                        if (!Array.isArray(models)) {
                            throw `modules models must be an array `;
                        }
                        if (models.length <= 0) {
                            throw `modules models is an empty array `;
                        }
                        for (const model of models) {
                            if (!"name" in model || model.name === undefined || model.name === null || model.name === '') {
                                throw `found modules models with name not set `;
                            }
                            if (!"path" in model || model.path === undefined || model.path === null || model.path === '') {
                                throw `found modules models with path not set `;
                            }
                            Logging.getInstance().debug(`${prefix} validating model '${model.name}' with path '${model.path}' `);
                            // check if the directory exists
                            let isDirectory = fs.statSync(model.path).isDirectory();
                            if (!isDirectory) {
                                throw ` the path ${fullPath} is not a directory`;
                            }
                        }
                    }
                    loadModulesConfig = modules;
            } else {
            Logging.getInstance().debug(`${prefix} no modules configuration found `);
            }
        } catch (error) {
            this.logError(prefix, error);
        }
        Logging.getInstance().debug(`${prefix} stop `);
        return loadModulesConfig;
    }

}

