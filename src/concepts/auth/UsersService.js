import bcrypt from 'bcrypt'
import BaseService from "../BaseService"
import uuid from 'uuid/v1'

export const MODEL_USERS_NAME = `users`

export type User = {
    date: String,
    name: String,
    surname: String,
    email: String,
    password: String,
    activated: Boolean,
    dni: String,
    phone: String,
    activated: Boolean,
    changePassword: Boolean,
    token: String
}

/**
 * Servicio de usuarios de mongo
 */
export default class UsersService extends BaseService {
    /**
     * Inicializar variables
     */
    constructor() {
        super()
        this.model = this.createModel(MODEL_USERS_NAME, {
            date: {type: String},
            name: {type: String},
            surname: {type: String},
            email: {type: String},
            password: {type: String},
            activated: {type: Boolean, default: false},
            dni: {type: String, required: true},
            phone: {type: String, required: true},
            activated: {type: Boolean, default: false},
            changePassword: {type: Boolean, default: false},
            token: {type: String, default: uuid},
            banned: {type: Boolean, default: false},
        }, (schema) => {
            schema.virtual(`description`).get(function({name, surname, email, dni}) {
                return `${name} ${surname} - ${email} ${dni}`
            })
        })
    }

    /**
     * Crear usuarios
     * @param {*} user
     */
    async createUser(user) {
        return await this.model.create({
            ...user,
            password: await this.hashPassword(user.password),
        })
    }

    /**
     * Function para activar usuarios
     * @param {*} id
     */
    async activateUser(id) {
        const user = await this.model.findById(id)
        user.activated = true
        await user.save()
        return user
    }

    /**
     * Cambiar contraseña
     * @param {*} param0
     */
    async changePass({user: {_id}, body: {pass}}) {
        const userDB = await this.model.findById(_id)
        userDB.password = await this.hashPassword(pass)
        userDB.changePassword = false
        await userDB.save()
        return userDB
    }

    /**
     * returns info from an Id
     * @param {*} id
     */
    async getMoreInfo(id) {
        return await this.model.findById(id)
    }
    /**
     * Buscar usuarios por email
     * @param {String} email
     */
    async searchUserByEmail(email) {
        return await this.model.findOne({email: email})
    }

    /**
     * Buscar usuarios por DNI
     * @param {*} DNI
     */
    async searchUserByDNI(DNI) {
        return await this.model.findOne({dni: DNI})
    }

    /**
     * Cifrar contraseña
     * @param {*} pass
     */
    async hashPassword(pass) {
        return await bcrypt.hash(pass, await bcrypt.genSalt(10))
    }

    /**
     * Función que sirve para comparar contraseñas
     * @param {*} input
     * @param {*} param1
     */
    async passwordIsSimilar(input, {password}) {
        return await bcrypt.compare(input, password)
    }

    /**
     * Buscar abogados
     */
    async searchAttorniers() {
        return await this.model.find({rol: `attorney`})
    }


    /**
     * Buscar abogados
     */
    async queryAttornier({query}) {
        if (query.query === ``) {
            return []
        }

        return await this.model.aggregate()
            .project(`name surname email dni rol avatar`)
            .addFields({desc: {$concat: [`$name`, ` `, `$surname`, ` `, `$dni`, ` `, `$email`]}})
            .match({'desc': {$regex: query.query, $options: `i`}})
    }
}
