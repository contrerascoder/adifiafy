import repl from 'repl'
import UsersService from '../concepts/auth/UsersService'

const models = {
    users: new UsersService(),
}

repl.start({
    prompt: `local console project > `,
}).context.models = models
