/* eslint-disable require-jsdoc */
import BaseController from "../BaseController"
import UsersService from "../auth/UsersService"
import getAllProfilesOf from "../auth/profiles"
import AdminProfileModel from "../auth/profiles/adminer"
import makeProfileMiddleware from "../../helpers/hasProfileFactory"

const service = new UsersService()

/**
 * Controlador de users
 */
export default class UserController extends BaseController<UsersService> {
    initRoutes() {
        this.router.use(makeProfileMiddleware(AdminProfileModel))

        this.router.get(`/`, this.getAllUsers.bind(this))
        this.router.get(`/admins`, this.getAdminList.bind(this))
        this.router.get(`/searchUser`, this.searchUser.bind(this))
        this.router.post(`/overrideAdmin/:admin`, this.overrideAdmin.bind(this))
        this.router.put(`/ban/:id`, this.banUser.bind(this))
        this.router.put(`/unban/:id`, this.unBanUser.bind(this))
        this.router.get(`/:id`, this.getUser.bind(this))
    }

    async banUser(req, res, next): any {
        try {
            await service.model.findByIdAndUpdate(req.params.id, {banned: true})
            res.status(200).end(`El usuario ha sido baneado`)
        } catch (error) {
            res.status(500).end(error.message)
        }
    }
    async unBanUser(req, res, next): any {
        try {
            await service.model.findByIdAndUpdate(req.params.id, {banned: false})
            res.status(200).end(`El usuario ha sido desbaneado`)
        } catch (error) {
            res.status(500).end(error.message)
        }
    }

    async getAllUsers(req, res, next): any {
        try {
            const allUsers = await service.model.find().select(`-password -token`)
            res.status(200).json(allUsers)
        } catch (error) {
            next(error)
        }
    }

    async getUser(req, res, next) {
        try {
            const user: any = await service.model.findById(req.params.id).select(`-password -token`)
            const profiles = await getAllProfilesOf(user._id)

            res.status(200).json({user, profiles})
        } catch (error) {
            next(error)
        }
    }

    async getAdminList(req, res, next) {
        try {
            const admins = await AdminProfileModel.find().populate(`user`)
            res.status(200).json(admins)
        } catch (error) {
            next(error)
        }
    }

    async searchUser(req, res, next) {
        try {
            const attorniers = await service.queryAttornier(req)

            res.status(200).json(attorniers)
        } catch (error) {
            next(error)
        }
    }

    async overrideAdmin(req, res, next) {
        try {
            const userAlreadyAdmin = await AdminProfileModel.findOne({
                user: req.body,
            })
            if (userAlreadyAdmin !== null) {
                return res.status(400).end(`El usuario ya es administrador`)
            }

            const admin = await AdminProfileModel.findOne({typeAdmin: req.params.admin})
            if (admin) {
                admin.user = req.body
                await admin.save()
                res.status(200).end(`El cambio se realizo con exito`)
            } else {
                const admin = await AdminProfileModel.create({
                    typeAdmin: req.params.admin,
                    user: req.body,
                })
                await admin.save()
            }
        } catch (error) {
            next(error)
        }
    }
}
