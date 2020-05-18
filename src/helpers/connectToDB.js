import mongoose from 'mongoose'
import {uriDB} from '../config/vars'
import EventEmitter from 'events'
import {logger} from '../utilities/logger'

export const eventConnectionDB = new EventEmitter()

export const CONNECTION_EVENT = `connected_to_db`

export const connecToDB = (cb) => mongoose.connect(uriDB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}, (err) => {
    if (err) {
        logger.error(`Hubo un error conectandose a la base de datos ${err.message}`)
        return process.exit(1)
    }
    eventConnectionDB.emit(CONNECTION_EVENT)
    if (cb) cb()
})
