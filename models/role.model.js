const { sq } = require("./index.model");
const { sequelize, DataTypes } = require("sequelize");
const role = sq.define("role", {
    role_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    permission_id: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        foreignKey: true
    }
});
role.sync().then(() => {
    console.log("Roles Model synced");
});



module.exports = role;