import BaseService from "../../BaseService"
import mongoose from 'mongoose'
import {MODEL_USERS_NAME} from "../UsersService"
import {MODEL_PHOTOS_NAME} from "../../photos/PhotoService"

export const MODEL_PHOTOGRAPHER_NAME = `photographer-profile`

/**
 * Profile de administrador
 */
export default class PhotographerProfileModel extends BaseService {
    /**
     * inicial variables
     */
    constructor() {
        super()
        this.model = this.createModel(MODEL_PHOTOGRAPHER_NAME, {
            user: {
                type: mongoose.Types.ObjectId,
                ref: MODEL_USERS_NAME,
            },
            year: {
                type: Number,
                default: () => new Date().getFullYear(),
            },
            photos: [{
                type: mongoose.Types.ObjectId,
                ref: MODEL_PHOTOS_NAME,
            }],
            dni: {
                type: String,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
        })
    }
}
