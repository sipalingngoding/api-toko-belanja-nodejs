const {ValidationError} = require("sequelize");
const ClientError = require("../error/client-error");
const ErrorMiddleware = (err,req,res,next) =>{
    if(!err){
        next();
        return
    }
    let statusCode = null;
    let message = null;
    if(err instanceof ValidationError){
        statusCode = 400;
        message = err.message;
    }else if(err instanceof ClientError){
        statusCode = err.statusCode;
        message = err.message;
    }else {
        statusCode = 500;
        // message = 'Internal Server Error';
        message = err.message;
    }
    return res.status(statusCode).json({
        status : 'fail',
        message,
    })
}


module.exports = ErrorMiddleware;