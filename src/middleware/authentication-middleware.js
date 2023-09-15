const Tokenize = require("../utils/tokenize");
const ClientError = require("../error/client-error");
const userService = new (require('../service/user-service'));
const authenticationMiddleware = async (req,res,next)=>{
    const token = req.get('Authorization');
    if(!token){
        return res.status(401).json({
            status : 'fail',
            message : 'Unauthorized',
        })
    }
    try {
        const decoded = Tokenize.verifyToken(token);
        const user = await userService.getById(decoded.id);
        req.userId = decoded.id;
        next();
    }catch (err){
        return res.status(401).json({
            status : 'fail',
            message : 'Unauthorized',
        })
    }
};


module.exports = authenticationMiddleware;