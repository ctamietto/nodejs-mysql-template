import Logging from "./Logging.js";

export default class MyBase {
    constructor() {
    }

    logError(prefixMessage, err, throwError = true) {
        let errorMessage = this.extractErrorMessage(err);
        Logging.getInstance().error(prefixMessage + " " + errorMessage);
        if (throwError) {
            throw (err);
        }
    }

    extractErrorMessage(err) {
        let typeofErr = typeof err;
        let errorMessage = "";
        if (typeofErr == "string") {
            errorMessage = err;
        } else {
            errorMessage = err.message;
            if ("original" in err && err.original !== undefined && err.original !== null) {
                if (errorMessage !== undefined && errorMessage !== null && errorMessage !== "") {
                    errorMessage = `${errorMessage} ${err.original.toString()}`;
                } else {
                    errorMessage = err.original.toString();
                }
            }
        }
        return errorMessage;
    }
}