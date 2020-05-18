import BaseService from "../BaseService"

export const EVENTS_MODEL_NAME = `events`

/**
 * Servicio de eventos
 */
export default class EventService extends BaseService {
    /**
     * Inicializar variables
     */
    constructor() {
        super()
        this.model = this.createModel(EVENTS_MODEL_NAME, {
            title: {type: String},
            body: {type: String},
            datetime: {type: Date},
            place: {type: String},
            approved: {type: Boolean, default: false},
        })
    }
}
