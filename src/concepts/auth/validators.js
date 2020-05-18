import {check} from 'express-validator'
import {createValidator} from "../../helpers/createValidator"

export const signUpValidator = createValidator([
    check(`name`).isLength({min: 6}).withMessage(`El nombre no es válido, como minimo tiene que ser de 6 caracteres`),
    check(`dni`).custom(nifIsValid).withMessage(`No es un dni válido`),
    check(`surname`).isLength({min: 10}).withMessage(`El apellido no es válido, como minimo tiene que ser de 10 caracteres`),
    check(`email`).isEmail().withMessage(`El email no es correcto`),
    check(`year`).isNumeric().withMessage(`El año no es valido`),
    check(`month`).isNumeric().withMessage(`El mes no es valido`),
    check(`day`).isNumeric().withMessage(`El dia no es valido`),
    // check(`password`).isLength({min: 6}).withMessage(`La contraseña no es valida`),
])

/**
 * Validar dnis
 * @param {*} dni DNI a validar
 * @return {boolean}
 */
export function nifIsValid(dni) {
    let numero
    let letr
    let letra
    const expresionRegularDni = /^\d{8}[a-zA-Z]$/

    if (expresionRegularDni.test(dni)) {
        numero = dni.substr(0, dni.length-1)
        letr = dni.substr(dni.length-1, 1)
        numero = numero % 23
        letra=`TRWAGMYFPDXBNJZSQVHLCKET`
        letra=letra.substring(numero, numero+1)
        return letra.toUpperCase()===letr.toUpperCase()
    } else {
        return false
    }
}
