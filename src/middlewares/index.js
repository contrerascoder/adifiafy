import cors from 'cors'
import {isProd} from '../config/vars'
import bodyParser from 'body-parser'
import {auditRequest} from './audit'
import {decodeUser} from './decode'
import errorHandler from './errorHandler'
export const preMiddlewares: Array<any> = [
    !isProd && cors(),
    decodeUser,
    bodyParser.json(),
    auditRequest,
].filter((m) => typeof m === `function`)

export const postMiddlewares: Array<any> = [
    errorHandler,
].filter((m) => typeof m === `function`)
