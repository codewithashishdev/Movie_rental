const config = require('../config/database.js')
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.DIALECT,
        port: config.PORT,
        // logging: false
    },    
    )

const testDbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

module.exports = { sq: sequelize, testDbConnection };