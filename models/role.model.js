const { sq } = require("./index.model");
const { sequelize, DataTypes } = require("sequelize");
const role  = sq.define("role", {
    role_name: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    permission_id:{
        type: DataTypes.STRING,
        allowNull: false
    }
});
role .sync().then(() => {
    console.log("Roles Model synced");
});



module.exports = role ;