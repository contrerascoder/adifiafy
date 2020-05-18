import CustomError from "../concepts/errors/CustomError"
import authedMiddleware from "../middlewares/authedUser"

export const makeProfileMiddleware = (profileModel) => [authedMiddleware, async function checkProfile(req, res, next) {
    try {
        console.log(`jhoamllakm`, profileModel)
        console.log(`jhoamllakm`)

        if (/jwt expired/.test(req.user)) {
            throw new CustomError(req.user)
        }
        const profile = await profileModel.findOne({user: req.user._id})

        console.log(profile, req.user)


        if (!profile) {
            return next(new CustomError(`No tienes el perfil adecuado para realizar esta acción`))
        }
        if (profile.disabled) {
            return next(new CustomError(`El perfile que hay registrado lo tienes desactivado`))
        }
        next()
    } catch (error) {
        next(error)
    }
}]

export default makeProfileMiddleware
