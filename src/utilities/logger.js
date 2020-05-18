import winston from 'winston'
import moment from 'moment'
import chalk from 'chalk'

const formatDated = winston.format.printf((info) => {
    const formattedDate = moment().format(`YYYY-MM-DD HH:mm`)
    if (/error/.test(info.level)) {
        return `${chalk.bold.yellow(`[app]`)} ${chalk.underline(formattedDate)} - ${info.level}: ${chalk.bold.red(info.message)}`
    } else {
        return `${chalk.bold.yellow(`[app]`)} ${chalk.underline(formattedDate)} - ${info.level}: ${chalk.bold(info.message)}`
    }
})

export const logger = winston.createLogger({
    level: `info`,

    format: winston.format.json(),
    // defaultMeta: {service: `user-service`},
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({filename: `logs/error.log`, level: `error`}),
        new winston.transports.File({filename: `logs/combined.log`}),
    ],
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
logger.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        formatDated,
    ),
}))
