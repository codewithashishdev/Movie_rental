const { sq } = require("./index.model");
const Rented_Movie = require('./rentalMovie.model')
const { sequelize, DataTypes } = require("sequelize");
console.log('this1')
const Users = sq.define("Users", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact_no: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["customer", 'admin']
    },
    otp: {
        type: DataTypes.STRING,
        defaultValue: null
    }
});
Users.sync().then(() => {
    console.log("User Model synced");
});

//user include rented_movie
Users.hasMany(Rented_Movie, { foreignKey: 'user_id' });
Rented_Movie.belongsTo(Users, { foreignKey: 'user_id' });

module.exports = Users;
