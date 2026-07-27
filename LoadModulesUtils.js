import Logging from './Logging.js';
import Config from './Config.js';
import fs from 'node:fs';
import path from 'node:path';
import MyBase from './MyBase.js';

export default class LoadModulesUtils extends MyBase {
    static instance = null;
    _models = new Map();
    static prefixMessage = "";

    constructor() {
        super();
        this.prefixMessage = "LoadModulesUtils";
        if (LoadModulesUtils.instance) {
            throw new Error('Use LoadModulesUtils.getInstance() to get the singleton instance.');
        }
    }

    static getInstance() {
        let prefix = `class LoadModulesUtils function getInstance`;
        Logging.getInstance().debug(`${prefix} start `);
        try {
            if (this.instance === null) {
                this.instance = new LoadModulesUtils();
            }
        } catch (error) {
            this.logError(prefix, error);
        }
        Logging.getInstance().debug(`${prefix} stop`);
        return this.instance;
    }

    // return an array of models full name
    getModels() {
        let prefix = `${this.prefixMessage} function getModels`;
        Logging.getInstance().debug(`${prefix} start `);
        let modelsKeys = null;
        try {
            if (this._models === undefined || this._models === null) {
                throw ` map _models not set`;
            }
            modelsKeys = [...this._models.keys()];;
        } catch (error) {
            this.logError(prefix, error);
        }
        Logging.getInstance().debug(`${prefix} end `);
        return modelsKeys;
    }

    // class name of models follow pattern namespace.model 
    // sample : comuni.gi_nazioni
    getModelClass(className) {
        let prefix = `${this.prefixMessage} function getModelClass`;
        Logging.getInstance().debug(`${prefix} start `);
        let classDefinition = null;
        try {
            if (className === undefined || className === null || className === '') {
                throw ` parameter className must be set`;
            }
            if (this._models === undefined || this._models === null) {
                throw ` map _models not set`;
            }
            if (!this._models.has(className)) {
                throw ` className ${className} not set in map _models`;
            }
            classDefinition = this._models.get(className);
        } catch (error) {
            this.logError(prefix, error);
        }
        Logging.getInstance().debug(`${prefix} end `);
        return classDefinition;
    }

    async load() {
        let prefix = `${this.prefixMessage} function load`;
        Logging.getInstance().debug(`${prefix} start `);
        try {
            let cfgi = Config.getInstance();
            let modulesConfig = cfgi.getLoadModulesConfig();
            if (modulesConfig !== undefined && modulesConfig !== null) {
                Logging.getInstance().debug(`${prefix} found modules Config ${JSON.stringify(modulesConfig)}`);
                if ("models" in modulesConfig && modulesConfig.models !== undefined && modulesConfig.models !== null) {
                    let modelsConfig = modulesConfig.models;
                    Logging.getInstance().debug(`${prefix} found models modules Config ${JSON.stringify(modelsConfig)}`);
                    if (modelsConfig.length > 0) {
                        for (const modelConfig of modelsConfig) {
                            let moduleLibName = modelConfig.name;
                            let moduleLibPath = modelConfig.path;
                            Logging.getInstance().debug(`${prefix} trying to load models '${moduleLibName}' from path '${moduleLibPath}'`);
                            const entries = fs.readdirSync(moduleLibPath);
                            Logging.getInstance().debug(`${prefix} entries '${JSON.stringify(entries)}' found in folder '${moduleLibPath}'`);
                            if (entries !== undefined && entries !== null && entries.length > 0) {
                                const files = entries.filter(name =>
                                    fs.lstatSync(path.join(moduleLibPath, name)).isFile()
                                );
                                Logging.getInstance().debug(`${prefix} files '${JSON.stringify(files)}' found in folder '${moduleLibPath}'`);
                                if (files !== undefined && files !== null && files.length > 0) {
                                    for (const file of files) {
                                        Logging.getInstance().debug(`${prefix} trying to load model module '${file}' from path '${moduleLibPath}'`);
                                        let fullPath = `${moduleLibPath}/${file}`;
                                        let modelModule = await import(fullPath);
                                        Logging.getInstance().debug(`${prefix} model module full path '${fullPath}' loaded '`);
                                        let modelClass = modelModule.default;
                                        let baseFileName = path.parse(file).name;
                                        let fullModelname = `${moduleLibName}.${baseFileName}`;
                                        Logging.getInstance().debug(`${prefix} added '${fullModelname}' to in memory model class map '`);
                                        this._models.set(fullModelname, modelClass);
                                    }
                                } else {
                                    Logging.getInstance().warn(`${prefix} folder '${moduleLibPath}' doesn't contain any files `);
                                }
                            } else {
                                Logging.getInstance().warn(`${prefix} folder '${moduleLibPath}' is empty `);
                            }
                        }
                    } else {
                        Logging.getInstance().warn(`${prefix} models modules is empty `);
                    }
                }
            }
        } catch (error) {
            this.logError(prefix, error);
        }
        Logging.getInstance().debug(`${prefix} end `);
    }

}