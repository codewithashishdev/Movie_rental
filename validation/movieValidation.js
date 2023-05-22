const Joi = require('joi');

//signup validation
const validateAddMovie = (data) => {
    let movieschema = Joi.object().keys({
        id: Joi.number(),
        movie_name: Joi.string().required(),
        release_date: Joi.string().required(),
        genre: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
    })
    return movieschema.validate(data);
};

const validateEditMovie =(data)=>{
    let movieschema = Joi.object().keys({
        movie_name: Joi.string(),
        release_date: Joi.string(),
        genre: Joi.string(),
        price: Joi.number(),
        quantity: Joi.number(),
    })
    return movieschema.validate(data);
}

module.exports = {
    validateAddMovie,
    validateEditMovie
};