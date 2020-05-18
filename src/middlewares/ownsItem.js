export const ownsItem = (model) => async function ownsItem(req, res, next) {
    try {
        const item = await model.findById(req.params.id)

        const isOwnUser = req.user._id.toString() === item.attorney.toString()

        if (isOwnUser) {
            next()
        } else {
            throw new Error(`Este elemento no te pertence`)
        }
    } catch (error) {
        next(error)
    }
}
