import AuditService from "./AuditModel"

const auditService = new AuditService()
/**
 * Funcion para auditar peticiones
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {void}
 */
export async function auditRequest(req, res, next) {
    if (req.method === `get`) {
        return next()
    }
    await auditService.addLine(
        req.path,
        req.method,
        JSON.stringify(req.body),
        JSON.stringify(req.query),
        JSON.stringify(req.user),
        req.ip,
        JSON.stringify(req.params)
    )
    next()
}
