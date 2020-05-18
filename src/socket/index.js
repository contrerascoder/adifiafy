import io from 'socket.io'
import socketEvents, {EVENT_MESSAGE, ADD_PHOTO_PUBLISHED, REMOVE_PHOTO_PUBLISHED} from './events'

/**
 * Configurar socket io
 * @param {*} app
 */
export default function configureSocket(app) {
    const socketIo = io(app)
    socketIo.on(`connection`, (socket) => {
        socket.on(EVENT_MESSAGE, sendResponse)

        socketEvents.on(ADD_PHOTO_PUBLISHED, (data) => socket.emit(ADD_PHOTO_PUBLISHED, data))
        socketEvents.on(REMOVE_PHOTO_PUBLISHED, (data) => socket.emit(REMOVE_PHOTO_PUBLISHED, data))


        /* #region  Funciones del socket io */

        /**
         * Funcion de prueba
         * @param {*} data
         */
        function sendResponse(data) {
            socket.emit(`MESSAGE_BACK`, `TU DIJISTE: ` + data)
        }

        /* #endregion */
    })
}

