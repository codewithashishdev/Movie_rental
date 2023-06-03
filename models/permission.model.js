const { sq } = require("./index.model");
const { sequelize, DataTypes } = require("sequelize");
const permision  = sq.define("permision", {
    permision_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    permissions_name:{
        type: DataTypes.STRING,
        allowNull: false
    }
});
permision.sync().then(() => {
    console.log("permision Model synced");
});

permision.hasMany(role, { foreignKey: 'permision_id' });
role.belongsTo(permision, { foreignKey: 'permision_id' });


module.exports = permision ;
