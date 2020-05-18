export const ENV = process.env.NODE_ENV || `development`
export const isProd = process.env.NODE_ENV === `production`
export const runnedWithNuxt = /nuxt/.test(process.argv.join())

export const port = process.env.PORT
export const uriDB = process.env.URIDB
export const salts = process.env.SALTS
export const baseServerUrl = process.env.BASE_URL
export const defaultUserPassword = process.env.DEFAULT_USER_PASSWD
export const secret = process.env.JWT_SECRET
export const emailAddress = process.env.EMAIL_NODEMAIL
export const emailPass = process.env.PASS_NODEMAIL
