import {port, uriDB, ENV} from "../config/vars"
import server from '../server'
import {eventConnectionDB, CONNECTION_EVENT} from "../helpers/connectToDB"
import {logger} from "../utilities/logger"

require(`dotenv`).config()

const listenServer = () => server.handler.listen(port, () => {
    logger.info(`El servidor esta corriendo en el puerto ${port}`)
    logger.info(`Esta es la base de datos que se esta usando ${uriDB}`)
})

logger.info(`Iniciando el entorno ${ENV}`)
// Levantar servidor al conectar a la base de datos (solo en modo desarrollo)
eventConnectionDB.on(CONNECTION_EVENT, listenServer)
