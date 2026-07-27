import Logging from "../Logging.js";
import GenericBo from "../bo/GenericBo.js";
import MyBase from "../MyBase.js";

export default class GenericBoRoutes extends MyBase {
    constructor() {
        super()
        this.prefixMessage = "class GenericBoRoutes ";
    }

    setup(app, apiPath, apiVersion) {
        let prefix = `${this.prefixMessage} function setup`;
        Logging.getInstance().debug(`${prefix} start params : apiPath = ${apiPath} , apiVersion = ${apiVersion}`);

        let route_bo_generic_list = `${apiPath}/${apiVersion}/bo/generic/list`
        app.post(route_bo_generic_list, async (req, res) => {
            Logging.getInstance().debug(`${prefix} post route ${route_bo_generic_list}`);
            let result = { status: "OK", message: "" };
            try {
                let params = Object.assign({}, req.query, req.body, req.params);
                let gbo = new GenericBo();
                result.data = await gbo.list(params);
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
            Logging.getInstance().debug(`${prefix} get route ${route_bo_generic_list}`);
        });
    }
}