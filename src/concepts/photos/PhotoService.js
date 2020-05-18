import BaseService from "../BaseService"
import mongoose from 'mongoose'
import {MODEL_PHOTOGRAPHER_NAME} from "../auth/profiles/photographer"

export const MODEL_PHOTOS_NAME = `photos`

/**
 * Servicio de fotos
 */
export default class PhotoService extends BaseService {
    /**
     * Inicializar variables
     */
    constructor() {
        super()
        this.model = this.createModel(MODEL_PHOTOS_NAME, {
            title: {type: String},
            body: {type: String},
            urlPhoto: {type: String},
            approved: {type: Boolean, default: false},
            photographer: {
                type: mongoose.Types.ObjectId,
                ref: MODEL_PHOTOGRAPHER_NAME,
            },
        })
    }
}
