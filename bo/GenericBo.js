import Logging from "../Logging.js";
import LoadModulesUtils from "../LoadModulesUtils.js";
import MyBase from "../MyBase.js";
import { Op } from 'sequelize';

export default class GenericBo extends MyBase {
    prefixMessage = "class GenericBo";
    modelName = null;

    constructor() {
        super();
    }

    buildSimpleFilter(params) {
        let message = `${this.prefixMessage} function buildWhereClause `;
        Logging.getInstance().debug(`${message} start `);
        let where = {
            [Op.and]: [

            ]
        };
        try {
            if ("filters" in params && params.filters !== undefined && params.filters !== null) {
                let filters = params.filters;
                if (!Array.isArray(filters)) {
                    let error_message = `params filter must be an array`;
                    throw new Error(error_message);
                }
                for (const filter of filters) {
                    if (!("name" in filter) || filter.name === undefined || filter.name === null) {
                        let error_message = `filter object must have a property name set`;
                        throw new Error(error_message);
                    }
                    let name = filter.name;
                    if (!("operator" in filter) || filter.operator === undefined || filter.operator === null) {
                        let error_message = `filter object with name '${name}' must have a property operator set`;
                        throw new Error(error_message);
                    }
                    let operator = filter.operator;
                    if (!("value" in filter) || filter.value === undefined || filter.value === null) {
                        let error_message = `filter object with name '${name}' must have a property value set`;
                        throw new Error(error_message);
                    }
                    let value = filter.value;

                    let sOperator = null;
                    switch (operator) {
                        case "equal":
                            sOperator = Op.eq;
                            break;
                        case "contains":
                            sOperator = Op.like;
                            value = `%${value}%`;
                            break;
                        default:
                            let error_message = `unespected value of operator ( '${operator}' )`;
                            throw new Error(error_message);
                    }
                    where[Op.and].push({
                        [name]: { [sOperator]: value }
                    });
                }
            }
        } catch (error) {
            this.logError(message, error);
        } finally {
        }
        Logging.getInstance().debug(`${message} end , where : ${JSON.stringify(where)}`);
        return where;
    }

    getOrder(params) {
        let message = `${this.prefixMessage} function getOffset `;
        Logging.getInstance().debug(`${message} start `);
        let order = null;

        try {
            let sortField = null;
            if ("sortField" in params && params.sortField !== null && params.sortField !== "") {
                sortField = params.sortField;
            }

            let sortOrder = null;
            if ("sortOrder" in params && params.sortOrder !== null && params.sortOrder !== "") {
                if (params.sortOrder === "desc" || params.sortOrder === "DESC") {
                    sortOrder = "DESC"
                } else {
                    sortOrder = "ASC"
                }
            }

            if (sortOrder != null && sortField != null) {
                order = [[sortField, sortOrder]];
            }
        } catch (error) {
            this.logError(message, error);
        } finally {
        }
        Logging.getInstance().debug(`${message} end`);
        return order;
    }

    getOffset(params) {
        let message = `${this.prefixMessage} function getOffset `;
        Logging.getInstance().debug(`${message} start `);
        let offset = 0;
        try {
            if ("offset" in params && params.offset !== undefined && params.offset !== null) {
                offset = params.offset;
                if (!Number.isInteger(offset)) {
                    if (typeof offset === 'string') {
                        if (offset === "") {
                            let error_message = `parameter offset must be an integer`;
                            throw new Error(error_message);
                        }
                        const match = offset.match(/^\d+$/);
                        if (match) {
                            offset = Number(match[0]); // convert matched substring to Number
                        } else {
                            let error_message = `parameter offset set as string and can't be converted to int `;
                            throw new Error(error_message);
                        }
                    } else {
                        let error_message = `parametro offset must be an integer , found type '${typeof offset}' with value '${offset}' `;
                        throw new Error(error_message);
                    }
                }
                if (offset < 0) {
                    let error_message = `param offset must be an integer greater or equal to zero`;
                    throw new Error(error_message);
                }
            }
        } catch (error) {
            this.logError(message, error);
        } finally {
        }
        Logging.getInstance().debug(`${message} end`);
        return offset;
    }


    getLimit(params) {
        let message = `${this.prefixMessage} function getLimit `;
        Logging.getInstance().debug(`${message} start `);
        let limit = 10;
        try {
            if ("limit" in params && params.limit !== undefined && params.limit !== null) {
                limit = params.limit;
                if (!Number.isInteger(limit)) {
                    if (typeof limit === 'string') {
                        if (limit == "") {
                            let error_message = `parameter limit must be an integer`;
                            throw new Error(error_message);
                        }
                        const match = limit.match(/^\d+$/);
                        if (match) {
                            limit = Number(match[0]); // convert matched substring to Number
                        } else {
                            let error_message = `parameter limit set as string and can't be converted to int `;
                            throw new Error(error_message);
                        }
                    } else {
                        let error_message = `parametro limit must be an integer , found type '${typeof limit}' with value '${limit}' `;
                        throw new Error(error_message);
                    }
                }
                if (limit <= 0) {
                    let error_message = `param limit must be an integer greater than zero`;
                    throw new Error(error_message);
                }
            }
        } catch (error) {
            this.logError(message, error);
        } finally {
        }
        Logging.getInstance().debug(`${message} end`);
        return limit;
    }

    async list(params) {
        let message = `${this.prefixMessage} function list `;
        Logging.getInstance().debug(`${message} start , params : ${JSON.stringify(params)}`);
        let data = { list: [], count: 0 };
        try {
            if (params === undefined || params === null) {
                let error_message = `params must be set`;
                throw new Error(error_message);
            }
            if (!("model" in params) || params.model === undefined || params.model === null || params.model === '') {
                let error_message = `model must be set`;
                throw new Error(error_message);
            }
            let model = params.model;
            let lmu = LoadModulesUtils.getInstance();
            let modelClass = lmu.getModelClass(model);
            let queryParams = {};
            if ("queryParams" in params && params.queryParams !== undefined && params.queryParams !== null) {
                queryParams = params.queryParams;
            }
            let limit = this.getLimit(queryParams);
            let offset = this.getOffset(queryParams);
            let order = this.getOrder(queryParams);
            let where =  this.buildSimpleFilter(queryParams);

            let findAllParams = {
                raw: true
            };
            if (limit !== null & offset !== null) {
                findAllParams.limit = limit;
                findAllParams.offset = offset;
            }
            if (order != null) {
                findAllParams.order = order;
            }
            if (where != null) {
                findAllParams.where = where;
            }
            const { rows, count } = await modelClass.findAndCountAll(findAllParams);
            data.list = rows;
            data.count = count;
        } catch (error) {
            this.logError(message, error);
        } finally {
        }
        Logging.getInstance().debug(`${message} end`);
        return data;
    }

}