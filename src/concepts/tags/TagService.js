import BaseService from "../BaseService"

export const MODEL_TAG_NAME = `tags`

/**
 * Servicio para los tags de los articulos
 */
export default class TagService extends BaseService {
    /**
     * inicializar el modelo
     */
    constructor() {
        super()
        this.model = this.createModel(MODEL_TAG_NAME, {
            name: {
                type: String,
                required: true,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
        })
    }
}
