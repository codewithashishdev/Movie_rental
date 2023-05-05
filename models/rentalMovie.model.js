const { sq } = require("./index.model");
const { DataTypes } = require("sequelize");
const Movie = require("./movie.model");
//rented_movie define
const Rented_Movie = sq.define("Rented_Movie", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        ForeignKey: true,
    },
    Movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        ForeignKey: true
    },
    Day_of_rent: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Day_till_rent: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    is_returned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}
);
Rented_Movie.sync().then(() => {
    console.log("Rented_Movie Model synced");
});

//for iclude rented_movie to movie
Movie.hasMany(Rented_Movie, { foreignKey: 'Movie_id' });
Rented_Movie.belongsTo(Movie, { foreignKey: 'Movie_id' });

module.exports = Rented_Movie;