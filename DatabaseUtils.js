import { QueryTypes } from 'sequelize';
import Config from './Config.js';
import Logging from './Logging.js';
import Database from './Database.js';

export default class DatabaseUtils {
    prefixMessage = "";

    constructor() {
        this.prefixMessage = "class DatabaseUtils";
    }

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

    async testDB() {
        let prefix = `${this.prefixMessage} function testDB`;
        Logging.getInstance().debug(`${prefix} start `);
        let data = null;
        try {
            let cfgi = await Config.getInstance();
            let connectionConfig = cfgi.getRepositoryConnenction();
            let testSqlStatement = connectionConfig.testSqlStatement;
            let db = Database.getInstance();
            let sequelize = db._sequelize;
            data = await sequelize.query(
                testSqlStatement,
                { type: QueryTypes.SELECT }
            );
            Logging.getInstance().debug(`${prefix} data : ${JSON.stringify(data)} `);
        } catch (error) {
            this.logError(prefix, error);
        }
        Logging.getInstance().debug(`${prefix} end `);
        return data;
    }

}



