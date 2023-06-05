const { sq } = require("./index.model");
const { sequelize, DataTypes } = require("sequelize");
const role = require('./role.model')

const permision = sq.define("permision", {
    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    permissions_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
permision.sync().then(() => {
    console.log("permision Model synced");
});

// permision.hasMany(role, { foreignKey: 'permission_id' });
// role.belongsTo(permision, { foreignKey: 'permission_id' });


module.exports = permision;
