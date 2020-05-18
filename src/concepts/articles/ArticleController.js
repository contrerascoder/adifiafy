import BaseController from "../BaseController"
import makeProfileMiddleware from "../../helpers/hasProfileFactory"
import AuthorProfileModel from "../auth/profiles/author"
import ArticleService, {STATES_ARTICLES} from "./ArticleService"
import {articleValidator} from "./validators"
import AdminProfileModel from "../auth/profiles/adminer"
import TagService from "../tags/TagService"
import cloudinary from 'cloudinary'
import multer from 'multer'

const upload = multer({dest: `/tmp`})

const profileService = new AuthorProfileModel()
const service = new ArticleService()
const tagService = new TagService()

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


/**
 * Controlador articulos
 */
export default class ArticleController extends BaseController {
    /**
     * Inicializar rutas
     */
    initRoutes() {
        this.router.post(`/`, makeProfileMiddleware(profileService.model), articleValidator, this.postArticle)
        this.router.post(`/image`, makeProfileMiddleware(profileService.model), upload.single(`image`), this.uploadImage)
        this.router.get(`/`, this.getAllArticles)
        this.router.get(`/last`, this.getLastArticles)
        this.router.get(`/tags`, this.searchTags)
        this.router.get(`/:id`, this.getAnArticle)
        this.router.put(`/:id`, makeProfileMiddleware(profileService.model), articleValidator, this.updateAnArticle)
        this.router.put(`/:id/draft`, makeProfileMiddleware(profileService.model), this.draftArticle)
        this.router.put(`/:id/review`, makeProfileMiddleware(profileService.model), this.reviewArticle)
        this.router.put(`/:id/publish`, makeProfileMiddleware(AdminProfileModel), this.publishArticle)
    }

    /**
     *  Middleware express
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async uploadImage(req, res, next) {
        try {
            const result = await uploadImage(req.file.path)

            res.status(200).json({
                success: 1,
                file: {
                    url: result.url,
                },
            })
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
    async searchTags(req, res, next) {
        try {
            const tags = !req.query.query ?
                await tagService.model.find({disabled: false}) :
                await tagService.model.aggregate()
                    .project(`name _id disabled`)
                    .match({
                        name: {$regex: req.query.query, $options: `i`},
                        disabled: false,
                    })
            res.status(200).json(tags)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Crear articulos
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async postArticle(req, res, next) {
        try {
            const article = await service.model.create({
                ...req.body,
                author: await profileService.model.findOne({user: req.user}),
            })
            await profileService.model.findOneAndUpdate({user: req.user}, {
                $push: {articles: article},
            })
            res.status(201).json(article)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Conseguir ultimos artículos
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async getLastArticles(req, res, next) {
        try {
            const articles = await service.model.find({state: STATES_ARTICLES.PUBLISHED}).sort(`-createdAt`).limit(3).populate({
                path: `author`,
                populate: {
                    path: `user`,
                },
            }).populate({
                path: `author`,
                select: `-articles -disabled`,
                populate: {
                    select: `name surname email`,
                    path: `user`,
                },
            }).populate(`tags`, `name`)
            return res.status(200).json(articles)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Conseguir artículos
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async getAllArticles(req, res, next) {
        try {
            if (!req.query.scope) {
                req.query.scope = STATES_ARTICLES.PUBLISHED
            }
            const scopes = {
                async own() {
                    const author = await profileService.model.findOne({user: req.user}).sort(`-createdAt`).populate(`articles`)
                    res.status(200).json(author)
                },
                async review() {
                    const admin = await AdminProfileModel.findOne({user: req.user})
                    if (!admin) {
                        return res.status(400).end(`No puedes realizar esta acción`)
                    }
                    const articles = await service.model.find({state: {$ne: STATES_ARTICLES.IN_DRAFT}}).sort(`-createdAt`).populate({
                        path: `author`,
                        select: `-articles -disabled`,
                        populate: {
                            select: `name surname email`,
                            path: `user`,
                        },
                    })
                    return res.status(200).json(articles)
                },
                async published() {
                    const articles = await service.model.find({state: STATES_ARTICLES.PUBLISHED}).sort(`-createdAt`).populate({
                        path: `author`,
                        populate: {
                            path: `user`,
                        },
                    }).populate({
                        path: `author`,
                        select: `-articles -disabled`,
                        populate: {
                            select: `name surname email`,
                            path: `user`,
                        },
                    }).populate(`tags`, `name`)
                    return res.status(200).json(articles)
                },
            }
            if (scopes[req.query.scope]) {
                await scopes[req.query.scope]()
            } else {
                return res.status(400).end(`No existe ese scope`)
            }
        } catch (error) {
            next(error)
        }
    }

    /**
     * Conseguir un articulo
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async getAnArticle(req, res, next) {
        try {
            const article = await service.model.findById(req.params.id).populate({
                path: `author`,
                select: `-articles -disabled`,
                populate: {
                    select: `name surname email`,
                    path: `user`,
                },
            })
            const articleStates = {
                async [STATES_ARTICLES.IN_DRAFT]() {
                    const author = await profileService.model.findOne({user: req.user})
                    if (article.author._id.toString() === author._id.toString()) {
                        return res.status(200).json(article)
                    } else {
                        return res.status(400).end(`No puedes realizar esta acción`)
                    }
                },
                async [STATES_ARTICLES.REVIEWING]() {
                    const author = await profileService.model.findOne({user: req.user})
                    const admin = await AdminProfileModel.findOne({user: req.user})
                    if (
                        (article.author._id.toString() === author._id.toString()) ||
                        (admin !== null)
                    ) {
                        return res.status(200).json(article)
                    } else {
                        return res.status(400).end(`No puedes realizar esta acción`)
                    }
                },
                async [STATES_ARTICLES.PUBLISHED]() {
                    return res.status(200).json(article)
                },
            }
            articleStates[article.state]()
        } catch (error) {
            next(error)
        }
    }

    /**
     * Actualizar un articulo
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async updateAnArticle(req, res, next) {
        try {
            const article = await service.model.findById(req.params.id)
            const articleStates = {
                async [STATES_ARTICLES.IN_DRAFT]() {
                    const author = await profileService.model.findOne({user: req.user})
                    if (article.author.toString() !== author._id.toString()) {
                        return res.status(400).end(`No puedes realizar esta accion`)
                    }

                    await service.model.findByIdAndUpdate(article._id, {$set: req.body})
                    const articleUpdated = await service.model.findById(req.params.id)
                    res.status(200).json(articleUpdated)
                },
                async [STATES_ARTICLES.REVIEWING]() {
                    const admin = await AdminProfileModel.findOne({user: req.user})
                    if (!admin) {
                        return res.status(400).end(`No puedes realizar esta accion`)
                    }
                    await service.model.findByIdAndUpdate(article._id, {$set: req.body})
                    const articleUpdated = await service.model.findById(req.params.id)
                    res.status(200).json(articleUpdated)
                },
            }
            articleStates[article.state]()
        } catch (error) {
            next(error)
        }
    }

    /**
     * Poner un articulo en borradores
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async draftArticle(req, res, next) {
        try {
            const article = await service.model.findById(req.params.id)
            const author = await profileService.model.findOne({user: req.user})
            if (article.state === STATES_ARTICLES.PUBLISHED) {
                return res.status(400).end(`Para que se pongan en borradores tiene que estar en revisión`)
            }
            if (article.author.toString() !== author._id.toString()) {
                return res.status(400).end(`Este artículo no se puede poner en borradores`)
            }
            article.state = STATES_ARTICLES.IN_DRAFT
            await article.save()
            res.status(200).end(`El articulo fue mandado a borradores`)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Poner un articulo en revision
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async reviewArticle(req, res, next) {
        try {
            const article = await service.model.findById(req.params.id)
            const author = await profileService.model.findOne({user: req.user})
            const admin = await AdminProfileModel.findOne({user: req.user})

            if (
                (article.state === STATES_ARTICLES.PUBLISHED && admin !== null) ||
                (article.state === STATES_ARTICLES.IN_DRAFT && article._id.toString() !== author._id.toString())
            ) {
                article.state = STATES_ARTICLES.REVIEWING
                await article.save()
                return res.status(200).end(`El articulo fue enviado a revisión`)
            }
            res.status(500).end(`No puedes realizar esta acción`)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Publicar un artículo
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async publishArticle(req, res, next) {
        try {
            const article = await service.model.findById(req.params.id)
            const admin = await AdminProfileModel.findOne({user: req.user})

            if (
                (article.state === STATES_ARTICLES.IN_DRAFT && admin === null)
            ) {
                res.status(500).end(`No puedes realizar esta acción`)
            }
            article.state = STATES_ARTICLES.PUBLISHED
            await article.save()
            return res.status(200).end(`El articulo fue publicado`)
        } catch (error) {
            next(error)
        }
    }
}
