const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'movie rentel',
            version: '1.0.0',
            description: 'API documentation using Swagger',
            contact: {
                email: 'ashish.makwana@codiot.com'
            }
        },
        servers: [{
            url: `${process.env.URL}`
        },
        {
            url: 'http://localhost:3000'
        }]
    },
    apis: [`./swagger/authSwagger.js`],
};
const swaggerDocs = swaggerJsDoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
