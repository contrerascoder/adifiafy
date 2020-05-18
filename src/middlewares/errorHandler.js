import CustomError from "../concepts/errors/CustomError"
import {logger} from "../utilities/logger"
/**
 * Manejar errores
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export default function errorHandler(err, req, res, next) {
    if (err instanceof CustomError) {
        res.status(500).end(err.message)
    } else {
        logger.error(`Se produjo un error durante una petición: ${err.message}`)
        res.status(500).end(`Hubo un error interno`)
    }
}
