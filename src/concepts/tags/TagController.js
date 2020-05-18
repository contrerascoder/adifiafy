import BaseController from "../BaseController"
import TagService from "./TagService"
import makeProfileMiddleware from "../../helpers/hasProfileFactory"
import AdminProfileModel from "../auth/profiles/adminer"

/**
 * Controlados para los tags
 */
export default class TagController extends BaseController {
    /**
     * Inicializar rutas
     */
    initRoutes() {
        this.service = new TagService()
        this.router.use(makeProfileMiddleware(AdminProfileModel))
        this.router.post(`/`, this.createTag.bind(this))
        this.router.get(`/`, this.getTags.bind(this))
        this.router.get(`/all`, this.getAllTags.bind(this))
        this.router.get(`/:id`, this.getTag.bind(this))
        this.router.put(`/:id`, this.updateTag.bind(this))
        this.router.put(`/habilitate/:id`, this.habilitateTag.bind(this))
        this.router.put(`/inhabilitate/:id`, this.inhabilitateTag.bind(this))
    }

    /**
     *  Middleware express
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async createTag(req, res, next) {
        try {
            const tag = await this.service.model.create(req.body)
            res.status(201).json(tag)
        } catch (error) {
            next(error)
        }
    }

    /**
     *  Middleware express
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async getTags(req, res, next) {
        try {
            const tags = await this.service.model.find({disabled: false})
            res.status(200).json(tags)
        } catch (error) {
            next(error)
        }
    }

    /**
     *  Middleware express
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async getAllTags(req, res, next) {
        try {
            const tags = await this.service.model.find({})
            res.status(200).json(tags)
        } catch (error) {
            next(error)
        }
    }

    /**
     *  Middleware express
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async getTag(req, res, next) {
        try {
            const tag = await this.service.model.findById(req.params.id)
            res.status(200).json(tag)
        } catch (error) {
            next(error)
        }
    }

    /**
     *  Middleware express
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async updateTag(req, res, next) {
        try {
            const tag = await this.service.model.findByIdAndUpdate(req.params.id, {$set: req.body})
            res.status(200).json(tag)
        } catch (error) {
            next(error)
        }
    }

    /**
     *  Middleware express
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async habilitateTag(req, res, next) {
        try {
            const tag = await this.service.model.findByIdAndUpdate(req.params.id, {$set: {disabled: false}})
            res.status(200).json(tag)
        } catch (error) {
            next(error)
        }
    }

    /**
     *  Middleware express
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async inhabilitateTag(req, res, next) {
        try {
            const tag = await this.service.model.findByIdAndUpdate(req.params.id, {$set: {disabled: true}})
            res.status(200).json(tag)
        } catch (error) {
            next(error)
        }
    }
}
