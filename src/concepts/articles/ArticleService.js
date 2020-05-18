import BaseService from "../BaseService"
import mongoose from 'mongoose'
import {MODEL_AUTHOR_NAME} from "../auth/profiles/author"
import {MODEL_TAG_NAME} from "../tags/TagService"

export const MODEL_ARTICLES_NAME = `articles`

export const STATES_ARTICLES = {
    PUBLISHED: `published`,
    REVIEWING: `reviewing`,
    IN_DRAFT: `in_draft`,
}

/**
 * Servicio de artículos
 */
export default class ArticleService extends BaseService {
    /**
     * Inicializar variables
     *
     */
    constructor() {
        super()
        this.model = this.createModel(MODEL_ARTICLES_NAME, {
            title: {type: String},
            body: {type: Object},
            category: {type: String},
            tags: [{
                type: mongoose.Types.ObjectId,
                ref: MODEL_TAG_NAME,
            }],
            author: {
                type: mongoose.Types.ObjectId,
                ref: MODEL_AUTHOR_NAME,
            },
            state: {
                type: String,
                enum: [STATES_ARTICLES.IN_DRAFT, STATES_ARTICLES.PUBLISHED, STATES_ARTICLES.REVIEWING],
                default: STATES_ARTICLES.IN_DRAFT,
            },
        })
    }
}
