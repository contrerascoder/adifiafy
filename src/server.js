import express from 'express'
import {connecToDB} from './helpers/connectToDB'
import {preMiddlewares, postMiddlewares} from './middlewares'
import {conceptsRouter} from './concepts'
import {runnedWithNuxt} from './config/vars'
import configureSocket from './socket'
import http from 'http'
import path from 'path'
require(`dotenv`).config()

const app = express()

preMiddlewares.length && app.use(preMiddlewares)

if (runnedWithNuxt) {
    app.use(conceptsRouter)
} else {
    app.use(`/api`, conceptsRouter)
}

postMiddlewares.length && app.use(postMiddlewares)

// Conectar a la base de datos
connecToDB()

const server = new http.Server(app)
configureSocket(server)

app.use(express.static(path.join(__dirname, `dist`)))

export default {
    path: `/api`,
    handler: server,
}
