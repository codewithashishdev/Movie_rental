const {createLogger,transports,format} = require('winston');

//logging function

const authLogger = createLogger({
    transports:[
        new transports.Console({
            format: format.combine(format.timestamp(),format.json()),
        }),
        new transports.File({
            filename:'api-logs.log',
            level:'info',
            format: format.combine(format.timestamp(),format.json()),
        }),
        new transports.File({
            filename:'error-logs.log',
            level:'error',
            format: format.combine(format.timestamp(),format.json()),
        })
    ]
})
// authLogger.info('Authentication successful');
// authLogger.error('Authentication failed');


module.exports = {authLogger}