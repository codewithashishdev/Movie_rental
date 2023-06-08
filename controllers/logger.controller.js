const {createLogger,transports,format} = require('winston');

//logging function

const authLogger = createLogger({
    transports:[
        new transports.Console(),
        new transports.File({
            filename:'authantication.log',
            level:'info',
            format: format.combine(format.timestamp(),format.json()),
        }),
        new transports.File({
            filename:'authantication-error.log',
            level:'error',
            format: format.combine(format.timestamp(),format.json()),
        })
    ]
})
// authLogger.info('Authentication successful');
// authLogger.error('Authentication failed');


module.exports = {authLogger}