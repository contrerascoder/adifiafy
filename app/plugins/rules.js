export const rules = {
    pleitodesc: (val) => val.length >= 20 || `La descripción del pleito no es valida`,
    name: (val) => val.length > 6 || `El nombre no es válido`,
    surname: (val) => val.length > 10 || `Los apellidos no son válidos`,
    charge: (val) => val.length > 7 || `El cargo introducido no es válido`,
    dni: (val) => nifIsValid(val) || `El dni no es valido`,
    email: (val) => validarEmail(val) || `El email no es valido`,
    phone: (val) => validarTelefono(val) || `El telefono no es valido`,
    year: (val) => val && yearIsValid(val) || `El año no es válido`,
    month: (val) => Number(val) > 0 && Number(val) <= 12 || `El mes no es válido`,
    day: (val) => Number(val) > 0 && Number(val) <= 31 || `El día no es válido`,
}

const yearIsValid = (val) =>
    Number(val) > (new Date().getFullYear() - 80) &&
    Number(val) < (new Date().getFullYear() - 18)

/**
 * Validar telefono
 * @param {*} numeroTelefono
 * @return {boolean}
 */
function validarTelefono(numeroTelefono) {
    return /([0-9]+){8}\w+/.test(numeroTelefono)
}

/**
 * Validar emails
 * @param {*} email
 * @return {boolean}
 */
function validarEmail(email) {
    const regexp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    return regexp.test(email)
}

/**
 * Validar dnis
 * @param {*} dni DNI a validar
 * @return {boolean}
 */
function nifIsValid(dni) {
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
        return !letra!=letr.toUpperCase()
    } else {
        return false
    }
}

export default rules
