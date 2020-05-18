import CustomError from "../concepts/errors/CustomError"

export const authedMiddleware = (req, res, next) => {
    try {
        if (!req.user) {
            return next(new CustomError(`Es necesario haber accedido al sistema`))
        }
        next()
    } catch (error) {
        next(error)
    }
}

export default authedMiddleware
