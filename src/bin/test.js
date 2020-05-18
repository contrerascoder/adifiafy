import {connecToDB} from "../helpers/connectToDB"
import PleitoService from "../concepts/pleitos/PleitoService"
import { logger } from "../utilities/logger"

const pleitoService = new PleitoService()

connecToDB((err) => {
    if (err) {
        return logger.error('Hubo un error conectandose a la base de datos: ' + err.message)
    }
    (async function() {
        const pleitos = await pleitoService.model.find().populate({
            path: `lines`,
            populate: {
                path: `user`,
            },
        })
    })()
})
