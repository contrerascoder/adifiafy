import BaseService from "../../concepts/BaseService"

/**
 * Servicio de auditoria de requests
 */
export default class AuditService extends BaseService {
    /**
     * Inicializacion variables
     */
    constructor() {
        super()
        this.model = this.createModel(`audit`, {
            time: {
                type: Date,
                default: Date.now,
            },
            path: String,
            method: String,
            body: String,
            query: String,
            user: String,
            ip: String,
            params: String,
        })
    }

    /**
     * Add line request
     * @param {*} path
     * @param {*} method
     * @param {*} body
     * @param {*} query
     * @param {*} user
     * @param {*} ip
     * @param {*} params
     */
    async addLine(path, method, body, query, user, ip, params) {
        return await this.model.create({path, method, body, query, user, ip, params})
    }
}
