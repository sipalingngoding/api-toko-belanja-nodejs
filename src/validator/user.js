const Joi = require("joi");
const userLoginSchema = ()=>{
    return Joi.object({
        email : Joi.string().email().required(),
        password : Joi.string().required(),
    });
};


module.exports = {
    userLoginSchema,
}