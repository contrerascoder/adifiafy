import BaseController from "../../BaseController"
import UsersService from "../UsersService"
import CustomError from "../../errors/CustomError"
import AdminProfileModel from "./adminer"
import PhotographerProfileModel from "./photographer"
import authedMiddleware from "../../../middlewares/authedUser"
import AuthorProfileModel from "./author"

const profiles = {
    admin: new AdminProfileModel(),
    photographer: new PhotographerProfileModel(),
    author: new AuthorProfileModel(),
}

const unauthedProfiles = [`photographer`]

/**
 * Controlador de perfiles
 */
export default class ProfileController extends BaseController<any> {
    /**
     * Inicializar rutas
     */
    initRoutes() {
        this.router.use(authedMiddleware)

        this.router.post(`/makePhotographer`, this.postProfile.bind(this))
        this.router.post(`/:profile/:user`, this.profileIsSupported, this.reviewProfile, this.postProfile.bind(this))
        this.router.delete(`/:profile/:user`, this.removeProfile.bind(this))
    }

    /**
     * profileIsSupported
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async profileIsSupported(req, res, next) {
        try {
            const profileList = Object.keys(profiles)
            const notExistsProfile = profileList.indexOf(req.params.profile) === -1
            if (notExistsProfile) {
                return res.status(400).end(`Ese perfil no esta soportado`)
            }
            next()
        } catch (error) {
            next(error)
        }
    }

    /**
     * Revisar el perfil que se quiere manejar
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async reviewProfile(req, res, next) {
        try {
            const notIsAnUnauthedProfile = unauthedProfiles.indexOf(req.params.profile) === -1
            if (notIsAnUnauthedProfile) {
                const admin = await AdminProfileModel.findOne({user: req.user})
                if (admin === null) {
                    return res.status(400).end(`No tienes permitida esta acción`)
                }
                return next()
            }
            return next()
        } catch (error) {
            next(error)
        }
    }

    /**
     * Crear perfiles
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async postProfile(req, res, next) {
        try {
            if (!req.params.profile) {
                req.params.profile = `photographer`
            }
            const query = {user: req.params.user || req.user._id}
            if (req.params.profile === `photographer`) query.year = new Date().getFullYear()

            const profileRegistered = await profiles[req.params.profile].model.findOne(query)

            if (profileRegistered && profileRegistered.disabled) {
                profileRegistered.disabled = false
                await profileRegistered.save()
                return res.status(201).json({
                    message: `El perfil estaba desactivado`,
                    profile: profileRegistered,
                })
            }

            const user = await new UsersService().model.findById(query.user)
            const profile = await createProfile(req, user)
            res.status(201).json(profile)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Eliminar perfiles
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async removeProfile(req, res, next) {
        try {
            const user = await new UsersService().model.findById(req.params.user)
            await profiles[req.params.profile].model.findOneAndUpdate({user: user}, {$set: {disabled: true}})
            res.status(200).json(`Ya se elimino el perfil`)
        } catch (error) {
            next(error)
        }
    }
}

/**
 * Crear perfiles
 * @param {*} param0
 * @param {*} user
 */
async function createProfile({params, query}, user) {
    let profile
    switch (params.profile) {
    case `administrator`:
        profile = await AdminProfileModel.create({
            user: user,
            typeAdmin: query.typeAdmin,
        })
        return profile

    case `photographer`:
        profile = await new PhotographerProfileModel().model.create({
            user: user,
            dni: user.dni,
        })
        return profile
    case `author`:
        profile = await new AuthorProfileModel().model.create({user})
        return profile
    default:
        throw new CustomError(`Ese perfil no es válido`)
    }
}
