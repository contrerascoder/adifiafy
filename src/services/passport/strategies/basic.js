import passport from 'passport'
import {BasicStrategy} from 'passport-http'
import boom from '@hapi/boom'
import UsersService from '../../../concepts/auth/UsersService'

const userService = new UsersService()

passport.use(new BasicStrategy(async (email, password, cb) => {
    try {
        const user = await userService.searchUserByEmail(email)

        if (!user) {
            return cb(boom.unauthorized(), false)
        }

        if (!(await userService.passwordIsSimilar(password, user))) {
            return cb(boom.unauthorized(), false)
        }

        delete user.password

        cb(null, user)
    } catch (error) {
        return cb(error)
    }
}))
