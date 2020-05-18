import BaseService from "../../BaseService"
import mongoose from 'mongoose'
import {MODEL_USERS_NAME} from "../UsersService"
import {MODEL_ARTICLES_NAME} from "../../articles/ArticleService"

export const MODEL_AUTHOR_NAME = `author-profile`

/**
 * Profile de administrador
 */
export default class AuthorProfileModel extends BaseService {
    /**
     * inicial variables
     */
    constructor() {
        super()
        this.model = this.createModel(MODEL_AUTHOR_NAME, {
            user: {
                type: mongoose.Types.ObjectId,
                ref: MODEL_USERS_NAME,
            },
            articles: [{
                type: mongoose.Types.ObjectId,
                ref: MODEL_ARTICLES_NAME,
            }],
            disabled: {
                type: Boolean,
                default: false,
            },
        })
    }
}
