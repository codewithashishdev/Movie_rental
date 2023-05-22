const { sq } = require("./index.model");
const { Sequelize, DataTypes } = require("sequelize");
// movie model define
const Movie = sq.define("Movie", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    movie_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    release_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    genre: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["Action", 'Drama', 'Horror', 'Thriller', 'Science fiction']
    },
    movie_title:{
        type: DataTypes.STRING,
        allowNull: false,
        },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}
);
Movie.sync().then(() => {
    console.log("Movie Model synced");
});

module.exports = Movie;