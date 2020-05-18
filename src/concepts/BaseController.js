import {Http} from '@status/codes'
import express from 'express'
import errorsEnumeration from './errors/errors'
import boom from '@hapi/boom'

/**
 * Clase base para las clases enrutadoras
 */
export default class BaseController<T> {
    http: any = Http
    router: express.Router = new express.Router()
    errors: any = errorsEnumeration
    boom: any = boom
    service: T
    /**
     * Incializar variables comunes para
     * todos los controladores
     */
    constructor() {
        this.initRoutes()
    }

    /**
     * Paginar resultados
     * @param {*} lastId
     * @param {*} model
     * @param {*} limit
     * @param {*} queryDocs
     */
    async paginate(lastId, model, limit = 20, queryDocs) {
        const query = lastId ?
            model.find({_id: {$lt: lastId}, ...queryDocs}).sort(`-createdAt`) :
            model.find(queryDocs).sort(`-createdAt`)
        return await model.paginate(query, {limit})
    }

    /**
     * Metodo que se llama desde el contructor
     * base para implementar inicializar las
     * rutas
     *
     * OBLIGATORIA SU REIMPLEMENTACIÓN
     */
    initRoutes() {
        throw new Error(`Las rutas de este controlador no han sido implementadas`)
    }
}
