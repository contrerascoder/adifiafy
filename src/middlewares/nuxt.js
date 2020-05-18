import {Nuxt} from 'nuxt'
import config from '../../nuxt.config'
import {isProd} from '../config/vars'

config.dev = !isProd

const finalConfig = {
    ...config,
    env: process.env,
    // axios: {
    //    baseURL: process.env.BASE_URL,
    // },
}

const nuxtInstance = new Nuxt(finalConfig)

export const nuxtMiddleware = nuxtInstance.render
