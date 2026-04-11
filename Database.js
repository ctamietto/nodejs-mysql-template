import { Sequelize, DataTypes } from 'sequelize';
import Config from './Config.js';
import Logging from './Logging.js';

export default class Database {
    // Static variable to hold the single instance (private with # in modern JS)
    static instance = null;
    static _sequelize = null;
    static prefixMessage = "";
    static dialect = null;

    logError(prefixMessage, err) {
        let typeofErr = typeof err;
        let errorMessage = "";
        if (typeofErr == "string") {
            errorMessage = err;
        } else {
            errorMessage = err.message;
        }
        Logging.getInstance().error(prefixMessage + " " + errorMessage);
        throw (err);
    }

    constructor() {
        this.prefixMessage = "Class Database ";
        if (Database.instance) {
            throw new Error('Use Database.getInstance() to get the singleton instance.');
        }
    }

    static getInstance() {
        if (this.instance === null) {
            this.instance = new Database();
        }
        return this.instance;
    }

    async getEngine() {
        let prefix = `${this.prefixMessage} function getEngine `;
        Logging.getInstance().debug(`${prefix} start `);
        let engine = null;
        try {
            if (this._sequelize === null) {
                throw new Error('Engine not initialized');
            }
            engine = this._sequelize;
        } catch (error) {
            this.logError(prefix, error);
        }
        Logging.getInstance().debug(`${prefix} stop`);
        return engine;
    }

    async getDialect() {
        let prefix = `${this.prefixMessage} function getDialect `;
        Logging.getInstance().debug(`${prefix} start `);
        let dialect = null;
        try {
            if (this.dialect === null || this.dialect === "") {
                throw new Error('dialect not set');
            }
            dialect = this.dialect;
        } catch (error) {
            this.logError(prefix, error);
        }
        Logging.getInstance().debug(`${prefix} stop`);
        return dialect;
    }

    async getTransaction(params) {
        let prefix = `${this.prefixMessage} function getDialect `;
        Logging.getInstance().debug(`${prefix} start `);
        let t = null;
        try {
            if (params === undefined || params === null) {
                throw new Error('params not set');
            }
            let engine = await this.getEngine();
            // TODO : manage parameters to setup the connection
            t = await engine.transaction();
            let dialect = await this.getDialect();
            if (dialect === "mssql") {
                await engine.query('SET LOCK_TIMEOUT 2000', { transaction: t });
            }
        } catch (error) {
            this.logError(prefix, error);
        }
        Logging.getInstance().debug(`${prefix} stop`);
        return t;
    }


    async initialize() {
        let prefix = `${this.prefixMessage} function initialize `;
        Logging.getInstance().debug(`${prefix} start `);
        try {
            let configInstance = await Config.getInstance();
            let connectionConfig = configInstance.getRepositoryConnenction();
            let username = connectionConfig.username;
            let password = connectionConfig.password;
            let hostname = connectionConfig.hostname;
            let database = connectionConfig.database;
            let dialect = connectionConfig.dialect;
            this.dialect = dialect;

            // MUST do this BEFORE sequelize.define() or sequelize instantiation
            DataTypes.DATE.prototype._stringify = function _stringify(date, options) {
                date = this._applyTimezone(date, options);
                return date.format('YYYY-MM-DD HH:mm:ss.SSS');  // No timezone!
            };

            this._sequelize =
                new Sequelize(
                    database,
                    username,
                    password,
                    {
                        host: hostname,
                        dialect: dialect,
                        pool: {
                            max: 10,        // Max active connections
                            min: 2,         // Min idle connections
                            acquire: 60000, // Max time to acquire connection (ms)
                            idle: 10000,    // Destroy idle after (ms)
                            evict: 0,       // Check idle every N ms (0=disable)
                        },
                        logging: console.log,  // Shows SQL queries
                        dialectOptions: {
                            options: {
                                encrypt: false,  // Key fix
                                trustServerCertificate: false,  // Not needed without encrypt
                                requestTimeout: 30000,
                                connectTimeout: 15000
                            }
                        }
                    }
                );

            await this._sequelize.authenticate();
            Logging.getInstance().debug(`${prefix} connection successfull`);

            //Logging.getInstance().debug(`${prefix} trying to initialize model test`);
            //test.initialize(this._sequelize)
            //Logging.getInstance().debug(`${prefix} module test initialized`);


        } catch (error) {
            this.logError(prefix, error);
        }
        Logging.getInstance().debug(`${prefix} stop`);
    }

}

