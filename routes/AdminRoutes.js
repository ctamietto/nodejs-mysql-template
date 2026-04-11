import Logging from "../Logging.js";

export default class AdminRoutes {
    constructor() {
        this.prefixMessage = "class AdminRoutes ";
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
        //throw (err);
    }

    setupAdminRoutes(app, apiPath, apiVersion) {
        let prefix = `${this.prefixMessage} function setupAdminRoutes`;
        Logging.getInstance().debug(`${prefix} start params : apiPath = ${apiPath} , apiVersion = ${apiVersion}`);

        app.get(`${apiPath}/${apiVersion}/ping`, (req, res) => {
            Logging.getInstance().debug(`${prefix} get route /ping start`);
            res.send({ status: "OK", message: "" });
            Logging.getInstance().debug(`${prefix} get route /ping stop`);
        });    
    }
}

