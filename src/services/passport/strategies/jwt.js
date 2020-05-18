import {Strategy, ExtractJwt} from 'passport-jwt'
import passport from 'passport'
import boom from '@hapi/boom'
import {secret} from "../../../config/vars"
import UsersService from '../../../concepts/auth/UsersService'

const usersService = new UsersService()

passport.use(new Strategy({
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}, async (payload, cb) => {
    try {
        const user = await usersService.searchUserByEmail(payload.email)

        if (!Object.keys(user).length) {
            cb(boom.unauthorized(), false)
        }

        delete user.password
        cb(null, {...user})
    } catch (error) {
        cb(error)
    }
}))

export const jwtMiddleware = passport.authenticate(`jwt`, {session: false})
