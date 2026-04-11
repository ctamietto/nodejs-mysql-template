import log4js from 'log4js';

export default class Logging {
    // Static variable to hold the single instance (private with # in modern JS)
    static instance = null;
    logger = null;
    level = null;
    static prefixMessage = "";

    constructor() {
        this.prefixMessage = "Class Logging ";
        if (Logging.instance) {
            throw new Error('Use Logging.getInstance() to get the singleton instance.');
        }
        let  deflogger = { type: 'console'}; 
        log4js.configure({
            appenders: { deflogger: deflogger },
            categories: { default: { appenders: ['deflogger'], level: 'error' } }
          });
        this.logger = log4js.getLogger('deflogger');
        this.level  = 'debug'; // default level
        this.logger.level = this.level;
    }

    static getInstance() {
        if (this.instance === null) {
            this.instance = new Logging();
        }
        return this.instance;
    }

    trace(message) {
        this.logger.trace(message);
    }

    debug(message) {
        this.logger.debug(message);
    }

    info(message) {
        this.logger.info(message);
    }

    warn(message) {
        this.logger.warn(message);
    }
    
    error(message) {
        this.logger.error(message);
    }

    fatal(message) {
        this.logger.fatal(message);
    }

}
