import BaseController from "../BaseController"
import UsersService from "./UsersService"
import sendMail from "../../services/mailer"
import {baseServerUrl, secret} from "../../config/vars"
import CustomError from "../errors/CustomError"
import {signUpValidator} from "./validators"
import jwt from 'jsonwebtoken'
import uuid from 'uuid/v1'
import AdminProfileModel, {ADMINISTRATOR_TYPES} from "./profiles/adminer"
import getAllProfilesOf from "./profiles"

const tokenExpirement = `2h`

/**
 * Clase controladora de las rutas de autenticación
 */
export default class AuthController extends BaseController<UsersService> {
    /**
     * Inicialización del router
     */
    constructor() {
        super()
        this.service = new UsersService()
    }

    /**
     * Implementación de initRoutes
     */
    initRoutes() {
        this.router.post(`/signup`, signUpValidator, this.signup.bind(this))
        this.router.post(`/signin`, this.signin.bind(this))
        this.router.get(`/dni/:dni`, this.searchByDNI.bind(this))
        this.router.post(`/checkpassword`, this.checkpassword.bind(this))
        this.router.get(`/activate`, this.activate.bind(this))
        this.router.get(`/moreInfo`, this.sendInfoToUserFromId.bind(this))
        this.router.post(`/postPass`, this.postPass.bind(this))
        this.router.get(`/requestnewpass`, this.requestNewPass.bind(this))
        this.router.post(`/changePass`, this.changePass.bind(this))
    }

    /**
     * Pedir nueva contraseña
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async requestNewPass(req, res, next) {
        this.service.hashPassword(`jsdjsdkjdskjds`)
        try {
            const user = await this.service.model.findOne({email: req.query.email})
            if (!user) {
                return res.status(400).end(`No tenemos registrado ese email`)
            }
            sendMail({to: user.email, text: `Esta es la dirección para cambiar la contraseña: ${baseServerUrl}/token/${user.token}?action=recoverpass`})
            res.status(200).end(`Se te ha enviado un mensaje a tu correo`)
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
    async changePass(req, res, next) {
        try {
            if (req.body.pass !== req.body.repass) {
                return res.status(400).end(`Las contraseñas no son iguales`)
            }
            const user = await this.service.model.findOne({token: req.query.token})
            if (!user) {
                return res.status(400).end(`El token no existe`)
            }
            user.password = await this.service.hashPassword(req.body.pass)
            user.token = uuid()
            await user.save()
            return res.status(200).end(`La contraseña se cambió correctamente`)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Ruta POST /auth/signup (Registrar usuarios)
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    async signup(req, res, next) {
        try {
            const {year, month, day} = req.body
            const date = `${year}-${month}-${day}`
            const userResearch = await this.service.searchUserByEmail(req.body.email)
            if (userResearch !== null) {
                throw new CustomError(`El email ya esta registrado`, this.errors.existentEmail)
            }
            if (!req.body.password) {
                req.body.password = `alumno`
                req.body.changePassword = true
            } else {
                if (req.body.password !== req.body.repassword) {
                    return res.status(this.http.BadRequest).end(`Las contraseñas no son iguales`)
                }
            }
            const user = await this.service.createUser({
                ...req.body,
                date: date,
            })

            const users = await this.service.model.find({})
            if (users.length === 1) {
                await AdminProfileModel.create({
                    typeAdmin: ADMINISTRATOR_TYPES.ADMIN,
                    user: user,
                })
            }

            delete user.password
            await sendMail({
                to: user.email,
                subject: `Nada mas que falta activar tu cuenta`,
                text: `Tan solo pincha en este <a href="${baseServerUrl}/auth/activate?id=${user._id}">Enlace</a>`,
            })
            res.status(201).json({
                message: `El usuario se ha creado correctamente, se te ha enviado un correo para activar tu cuenta`,
                data: user,
            })
        } catch (error) {
            next(error)
        }
    }

    /**
     * POST /auth/signin Login de usuarios
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    async signin(req, res, next) {
        const user = await this.service.model.findOne({email: req.body.email})
        if (!user) {
            return res.status(this.http.Unauthorized).end(`Credenciales incorrectas`)
        }

        if (!(await this.service.passwordIsSimilar(req.body.password, user))) {
            return res.status(this.http.Unauthorized).end(`Credenciales incorrectas`)
        }

        if (user.banned) {
            return res.status(this.http.Forbidden).end(`Estas baneado`)
        }

        const {_id, name, email} = user
        const payload = {
            sub: _id,
            name: name,
            email: email,
        }
        const token = jwt.sign(payload, secret, {
            expiresIn: tokenExpirement,
        })
        return res.status(200).json({token, user: {_id}, tokenExpirement})
    }

    /**
     * Buscar por dni
     * @param {*} req
     * @param {*} res
     */
    async searchByDNI(req, res) {
        const user = await this.service.searchUserByDNI(req.params.dni)
        return res.status(user === null ? this.http.NotFound : this.http.Ok).end()
    }

    /**
     * Comprobar contraseña
     * @param {*} req
     * @param {*} res
     */
    async checkpassword(req, res) {
        const user = await this.service.searchUserByDNI(req.body.dni)
        const result = await this.service.passwordIsSimilar(req.body.password, user)
        res.status(result ? this.http.Ok : this.http.BadRequest).end(`La contraseña no es correcta`)
    }

    /**
     * Ruta GET /auth/activate (Activar cuentas de usuario)
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    async activate(req, res, next) {
        try {
            await this.service.activateUser(req.query.id)
            return res.status(200).redirect(`/`)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Mandar al usuario la información de su usuario
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    async sendInfoToUserFromId(req, res) {
        const userInfo = {
            ...req.user._doc,
            password: ``,
        }
        userInfo.profiles = await getAllProfilesOf(userInfo._id)

        delete userInfo.password
        res.status(200).json(userInfo)
    }

    /**
     * Endpoint para cambiar la contraseña
     * @param {*} req Objeto de express de peticion
     * @param {*} res Objeto de respuesta de peticion
     * @param {*} next Funcion next
     */
    async postPass(req, res, next) {
        try {
            if (req.body.pass !== req.body.repass) {
                return res.status(400).end(`Las contraseñas no son iguales`)
            }
            await this.service.changePass(req)
            return res.status(200).end(`La contraseña ha sido cambiada`)
        } catch (error) {
            next(error)
        }
    }
}
