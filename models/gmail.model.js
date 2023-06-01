const { sq } = require("./index.model");
const { sequelize, DataTypes } = require("sequelize");
const Gmails = sq.define("Gmails", {
    mail_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mail_text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    send_by: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
});

Gmails.sync().then(() => {
    console.log("Gmails Model synced");
});


module.exports = Gmails;