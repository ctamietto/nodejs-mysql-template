import Logging from "../Logging.js";
import AdminRoutes from "./AdminRoutes.js";

export default class Routes {
    // Static variable to hold the single instance (private with # in modern JS)
    static instance = null;
    static prefixMessage = "";

    constructor() {
        this.prefixMessage = "class Routes";
        if (Routes.instance) {
            throw new Error('Use Routes.getInstance() to get the singleton instance.');
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
        let prefix = `class Routes function getInstance`;
        Logging.getInstance().debug(`${prefix} start `);
        try {
            if (this.instance === null) {
                this.instance = new Routes();
            }
        } catch (error) {
            this.logError(prefix, error);
        }
        Logging.getInstance().debug(`${prefix} stop`);
        return this.instance;
    }

    setupRoutes(app,apiPath,apiVersion) {
        let prefix = `${this.prefixMessage} function setupRoutes`;
        Logging.getInstance().debug(`${prefix} start params : apiPath = ${apiPath} , apiVersion = ${apiVersion}`);

        //  API CONFIGURAZIONE AMMINISTRAZIONE
        let ar = new AdminRoutes();
        ar.setupAdminRoutes(app,apiPath,apiVersion);

        Logging.getInstance().debug(`${prefix} stop`);
    }
}
