import {validationResult} from 'express-validator'

/**
 * Función que mira si existen errores
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {void}
 */
function checkIfErrorsExists(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
    }
    next()
}

export const createValidator = (validators) => ([
    validators, checkIfErrorsExists,
])
