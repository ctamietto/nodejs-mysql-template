import Logging from "../Logging.js";
import DatabaseUtils from "../DatabaseUtils.js";

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

        let route_test_db = `${apiPath}/${apiVersion}/test/db` 
        app.get(route_test_db, async (req, res) => {
            Logging.getInstance().debug(`${prefix} get route ${route_test_db}`);
            let result = { status: "OK", message: "" };
            try {
                //let params = Object.assign({}, req.query, req.body, req.params);
                let dbu = new DatabaseUtils();
                result.data = await dbu.testDB();
            } catch (error) {
                this.logError(prefix, error);
                result.status = 'KO';
                let typeofErr = typeof error;
                if (typeofErr == "string") {
                    result.message = error;
                } else {
                    result.message = error.message;
                }
            }
            res.send(result);
            Logging.getInstance().debug(`${prefix} get route ${route_test_db}`);
        });

    }
}

