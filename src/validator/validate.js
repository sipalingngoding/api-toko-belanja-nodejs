const ClientError = require("../error/client-error");
const validate = (schema,input)=>{
    const {error,value } = schema.validate(input);

    if(error) throw new ClientError(error.message);
    return value;
};


module.exports = validate;