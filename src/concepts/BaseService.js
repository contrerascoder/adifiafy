import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2'

const models: {[string]: mongoose.Model} = {}

/**
 * Clase base para hacer apis para controlar la base de datos
 */
export default class BaseService {
    model: mongoose.Model
    /**
     * Helper para crear modelos
     * @param {*} name
     * @param {*} config
     * @param {*} fn
     * @return {mongoose.Model}
     */
    createModel(name: string, config: any, fn: any) {
        if (models[name]) {
            return models[name]
        }
        const schema = new mongoose.Schema({
            ...config,
            createdAt: {type: Date, default: Date.now},
            supdatedAt: {type: Date, default: Date.now},
        })
        schema.plugin(paginate)
        if (fn) {
            fn(schema)
        }
        const model = mongoose.model(name, schema)
        models[name] = model
        return model
    }
}
