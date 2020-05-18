import jwt from 'jsonwebtoken'
import {secret} from '../config/vars'
import UsersService from '../concepts/auth/UsersService'

const users = new UsersService()

/**
 * Decodificar el usuario
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function decodeUser(req, res, next) {
    if (!req.headers.authorization) {
        return next()
    }
    jwt.verify(req.headers.authorization, secret, async (err, decoded) => {
        if (err) {
            req.user = err.message
            next()
        } else {
            req.user = await users.searchUserByEmail(decoded.email)
            next()
        }
    })
}
