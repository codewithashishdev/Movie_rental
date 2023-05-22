const Joi = require('joi');

const validateRentelMovie =(data)=>{
        let movieschema = Joi.object().keys({
            Movie_id: Joi.number().required(),
            Day_of_rent: Joi.string().required(),
            Day_till_rent: Joi.string().required(),
            is_returned: Joi.boolean(),
        })
    return movieschema.validate(data);
}

module.exports = {
    validateRentelMovie
};