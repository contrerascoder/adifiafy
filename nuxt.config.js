import 'dotenv/config'

/**
 * Para arrancarlo en modo estatico la app
 * arrancar nuxt generate, copiar la carpeta
 * dist a la carpeta del server y arrancar el
 * servidor con este comando...
 * node -r @babel/register -r @babel/polyfill -r dotenv/config src/bin/server.js
 */

const prod = process.env.NODE_ENV === `production`
const isBuilding = /build/.test(process.argv.join())

const [urlSocketIO, baseURL] = [
    prod ? `/api/socket.io/socket.io.js` : `http://localhost:8080/socket.io/socket.io.js`,
    prod ? `/api` : process.env.BASE_URL,
]

const socketIoOptions = {path: `/api`}

const config = {
    dev: true,
    head: {
        titleTemplate: `%s - Adifia`,
        link: [
            {rel: `stylesheet`, href: `https://cdn.jsdelivr.net/npm/alertifyjs@1.12.0/build/css/alertify.min.css`},
            {rel: `stylesheet`, href: `https://cdn.jsdelivr.net/npm/alertifyjs@1.12.0/build/css/themes/semantic.min.css`},
            {rel: `stylesheet`, href: `https://fonts.googleapis.com/css?family=Cousine|EB+Garamond&display=swap`},
        ],
        script: [
            {src: `https://cdn.jsdelivr.net/npm/alertifyjs@1.12.0/build/alertify.min.js`},
            {src: urlSocketIO},
        ],
        meta: [
            {charset: `utf-8`},
            {name: `viewport`, content: `width=device-width, initial-scale=1`},
            {name: `socketoptions`, content: JSON.stringify(socketIoOptions)},
            {name: `base-url`, content: baseURL},
        ],
    },
    rootDir: `app`,
    buildModules: [
        [`@nuxtjs/vuetify`, {
            theme: {
                primary: `#795548`,
                secondary: `#ff9800`,
                accent: `#3f51b5`,
                error: `#f44336`,
                warning: `#ffeb3b`,
                info: `#00bcd4`,
                success: `#4caf50`,
            },
        }],
    ],
    modules: [
        `@nuxtjs/axios`,
    ],
    plugins: [
        `~/plugins/global-settings.js`,
        {src: `~/plugins/json-pretty.js`, mode: `client`},
        {src: `~/plugins/localstorage.js`, mode: `client`},
        {src: `~/plugins/editorjs.js`, mode: `client`},
    ],
    axios: {
        baseURL: baseURL,
    },
}

if (prod && !isBuilding) {
    const server = require(`./server/server.js`)
    config.serverMiddleware = [server.default]
} else {
    config.modules.splice(0, 0, [`@nuxtjs/eslint-module`, {
        quiet: true,
    }])
}

module.exports = config
