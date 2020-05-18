/**
 * Errores propios
 */
export default class CustomError extends Error {
    /**
     * Inicialización del error
     * @param {*} message
     * @param {*} name
     */
    constructor(message, name) {
        super(message)
        this.name = name
    }
}
