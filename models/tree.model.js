const { sq } = require("./index.model");
const { sequelize, DataTypes } = require("sequelize");
const Tree = sq.define("Tree", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM,
        values: ["file", 'folder'],
        allowNull: false,
    },
    perent: {
        type: DataTypes.INTEGER
    },
    child: {
        type: DataTypes.ARRAY(DataTypes.INTEGER)
    }
});

Tree.hasMany(Tree, { as: 'children', foreignKey: 'perent' });

Tree.sync().then(() => {
    console.log("Tree Model synced");
});

module.exports = Tree;

