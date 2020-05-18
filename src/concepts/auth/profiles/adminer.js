import BaseService from "../../BaseService"
import mongoose from 'mongoose'
import {MODEL_USERS_NAME} from "../UsersService"

export const MODEL_ADMIN_NAME = `admin-profile`

export const ADMINISTRATOR_TYPES = {
    ADMIN: `administrator`,
    SECRETARY: `secretary`,
    TREASURER: `treasurer`,
}

/**
 * Profile de administrador
 */
class AdminerProfile extends BaseService {
    /**
     * inicial variables
     */
    constructor() {
        super()
        this.model = this.createModel(MODEL_ADMIN_NAME, {
            typeAdmin: {
                type: String,
                enum: [ADMINISTRATOR_TYPES.ADMIN, ADMINISTRATOR_TYPES.SECRETARY, ADMINISTRATOR_TYPES.TREASURER],
            },
            user: {
                type: mongoose.Types.ObjectId,
                ref: MODEL_USERS_NAME,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
        })
    }
}

export const AdminProfileModel = new AdminerProfile().model
export default AdminProfileModel
