import BaseController from "../BaseController"
import AdminProfileModel from "../auth/profiles/adminer"
import PhotoService from "./PhotoService"
import PhotographerProfileModel from "../auth/profiles/photographer"
import {photoMiddleware} from "./multermiddlewares"
import cloudinary from 'cloudinary'
import socketEvents, {ADD_PHOTO_PUBLISHED, REMOVE_PHOTO_PUBLISHED} from "../../socket/events"

cloudinary.config({
    cloud_name: `dqscsxfcv`,
    api_key: `373296566438398`,
    api_secret: `VULQe4BCpTC1HmXh8SQzgvmlPVY`,
})

const uploadImage = (path) => new Promise((resolve, reject) => {
    cloudinary.uploader.upload(path, function(result) {
        resolve(result)
    })
})

const service = new PhotoService()

/**
 * Controlador para las fotos
 */
export default class PhotoController extends BaseController<PhotoService> {
    /**
     * Iniciar rutas
     */
    initRoutes() {
        this.router.get(`/`, this.getAllPhotos.bind(this))
        this.router.get(`/last`, this.getLastPhotos.bind(this))
        this.router.get(`/:id`, this.getAPhoto.bind(this))
        this.router.post(`/`, photoMiddleware, this.postPhoto.bind(this))
        this.router.put(`/:id`, this.updatePhoto.bind(this))
        this.router.put(`/:id/approve`, this.approvePhoto.bind(this))
        this.router.put(`/:id/unapprove`, this.unapprovePhoto.bind(this))
        this.router.delete(`/:id`, this.deletePhoto.bind(this))
    }

    /**
     * Conseguir ultimas fotos
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async getLastPhotos(req, res, next) {
        try {
            const photos = await this.paginate(req.query.lastId, service.model, 3, {approved: true})
            return res.status(200).json(photos)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Conseguir todas las fotos
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async getAllPhotos(req, res, next) {
        try {
            let photos
            switch (req.query.scope) {
            case `own`:
                if (!req.user) {
                    return res.status(400).end(`No has accedido al sistema`)
                }
                photos = await new PhotographerProfileModel().model.findOne({user: req.user}).sort(`-createdAt`).populate(`photos`)
                return res.status(200).json(photos)
            case `all`:
                const admin = await AdminProfileModel.findOne({user: req.user})
                const isAdmin = admin !== null
                if (!isAdmin) {
                    return res.status(400).json(`Necesitas ser amdinistrador`)
                }

                return res.status(200).json(await this.paginate(req.query.lastId, service.model, 20, {}))
            default:
                photos = await this.paginate(req.query.lastId, service.model, 20, {approved: true})
                return res.status(200).json(photos)
            }
        } catch (error) {
            next(error)
        }
    }

    /**
     * Conseguir una foto
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async getAPhoto(req, res, next) {
        try {
            const photo = await service.model.findOne({_id: req.params.id, approved: true})
            if (photo && photo.approved) {
                const backPhotos = await service.model.find({_id: {$lt: req.params.id}, approved: true})
                const nextPhotos = await service.model.find({_id: {$gt: req.params.id}, approved: true})
                const items = [...backPhotos, photo, ...nextPhotos]
                return res.status(200).json(items)
            } else {
                return res.status(404).end(`La foto no fue encontrada`)
            }
        } catch (error) {
            next(error)
        }
    }

    /**
     * Crear una foto
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async postPhoto(req, res, next) {
        try {
            const query = {user: req.user, year: new Date().getFullYear()}
            const photographer = await new PhotographerProfileModel().model.findOne(query).populate(`photos`)
            if (!photographer) {
                return res.status(400).end(`No eres fotografo, tienes que registrarte`)
            }
            if (photographer.photos.length >= 3) {
                return res.status(400).end(`Ya has subido mas de tres fotos este año, esperate al año siguiente`)
            }
            if (!req.file) {
                return res.status(400).end(`No esta presente la imagen`)
            }
            const {url} = await uploadImage(req.file.path)
            const photo = await service.model.create({
                ...req.body,
                urlPhoto: url,
                photographer: photographer,
            })
            await new PhotographerProfileModel().model.findByIdAndUpdate(photographer._id, {
                $push: {photos: photo},
            })
            res.status(201).json(photo)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Actualizar una foto
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async updatePhoto(req, res, next) {
        try {
            const query = {user: req.user, year: new Date().getFullYear()}
            const photographer = await new PhotographerProfileModel().model.findOne(query)
            await service.model.findOneAndUpdate({_id: req.params.id, photographer: photographer}, {
                $set: req.body,
            })
            return res.status(200).end(`La foto fue actualizada correctamente`)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Aprobar una foto
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async approvePhoto(req, res, next) {
        try {
            const update = await service.model.findOneAndUpdate({_id: req.params.id}, {
                $set: {approved: true},
            })
            socketEvents.emit(ADD_PHOTO_PUBLISHED, update)
            return res.status(200).end(`La foto fue aprobada correctamente`)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Desaprobar una foto
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async unapprovePhoto(req, res, next) {
        try {
            const update = await service.model.findOneAndUpdate({_id: req.params.id}, {
                $set: {approved: false},
            })
            socketEvents.emit(REMOVE_PHOTO_PUBLISHED, update)
            return res.status(200).end(`La foto fue desaprobada correctamente`)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Eliminar una foto
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async deletePhoto(req, res, next) {
        try {
            const query = {user: req.user, year: new Date().getFullYear()}
            const photographer = await new PhotographerProfileModel().model.findOne(query)
            await service.model.findOneAndRemove({_id: req.params.id, photographer: photographer})
            return res.status(200).end(`La foto fue eliminada correctamente`)
        } catch (error) {
            next(error)
        }
    }
}
