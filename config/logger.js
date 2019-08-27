const { createLogger, format, transports } = require('winston')


const customFormat = printf(({level, message, path, timestamp}) => {
    return `${timestamp} 
        Level: ${level}: 
        Message: ${message}
        Path: ${path}`
})

const Logger = createLogger({
    level: "error",
    format: format.combine(
        format.json(),
        customFormat
    ),
    transports: [
        new transports.File({ filename: ( _ => `../logs/${Date.now()}` ) })
    ]
})

const logError = (msg, path) => {
    Logger.log({
        level: "Error",
        message: msg,
        timestamp: Date.now(),
        path: path
    })
}

module.exports = logError