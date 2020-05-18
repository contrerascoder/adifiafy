import BaseController from "../BaseController"
import makeProfileMiddleware from "../../helpers/hasProfileFactory"
import AdminProfileModel from "../auth/profiles/adminer"
import EventService from "./EventService"
import {validator} from "./validators"

const service = new EventService()

/**
 * Controlador de la api de eventos
 */
export default class EventController extends BaseController<EventService> {
    /**
     * Iniciar rutas
     */
    initRoutes() {
        this.router.get(`/`, makeProfileMiddleware(AdminProfileModel), this.getAllEvents.bind(this))
        this.router.post(`/`, makeProfileMiddleware(AdminProfileModel), validator, this.createEvent.bind(this))
        this.router.get(`/lastevent`, this.getLastEvent.bind(this))
        this.router.get(`/:id`, makeProfileMiddleware(AdminProfileModel), this.findEvent.bind(this))
        this.router.put(`/:id`, makeProfileMiddleware(AdminProfileModel), validator, this.updateEvent.bind(this))
        this.router.put(`/:id/approve`, makeProfileMiddleware(AdminProfileModel), this.approveEvent.bind(this))
        this.router.put(`/:id/unapprove`, makeProfileMiddleware(AdminProfileModel), this.unapproveEvent.bind(this))
    }

    /**
     * Conseguir todos los eventos
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async getAllEvents(req, res, next) {
        try {
            const events = await service.model.find().sort(`-createdAt`)
            res.status(200).json(events)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Crear evento
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async createEvent(req, res, next) {
        try {
            const event = await service.model.create({
                ...req.body,
                datetime: new Date(`${req.body.date} ${req.body.time}`).getTime(),
            })
            res.status(201).json(event)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Recuperar un evento
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async findEvent(req, res, next) {
        try {
            const event = await service.model.findById(req.params.id)
            res.status(200).json(event)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Actualizar un evento
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async updateEvent(req, res, next) {
        try {
            await service.model.findByIdAndUpdate(req.params.id, {$set: {
                ...req.body,
                datetime: new Date(`${req.body.date} ${req.body.time}`).getTime(),
            }})
            const event = await service.model.findById(req.params.id)
            res.status(200).json(event)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Aprobar un evento
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async approveEvent(req, res, next) {
        try {
            const event = await service.model.findByIdAndUpdate(req.params.id, {$set: {approved: true}})
            res.status(200).json(event)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Desaprobar un evento
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async unapproveEvent(req, res, next) {
        try {
            const event = await service.model.findByIdAndUpdate(req.params.id, {$set: {approved: false}})
            res.status(200).json(event)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Conseguir ultimo evento
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async getLastEvent(req, res, next) {
        try {
            const event = await service.model.findOne({datetime: {$gt: new Date()}, approved: true})
            res.status(200).json(event)
        } catch (error) {
            next(error)
        }
    }
}
