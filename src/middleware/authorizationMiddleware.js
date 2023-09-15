const userService = new (require('../service/user-service'));
const authorizationMiddleware = async (req,res,next) =>{
    const user = await userService.getById(req.userId);
    if(user.role !== 'admin'){
        return res.status(403).json({
            status : 'fail',
            message : 'forbidden',
        });
    }
    next();
};

module.exports = authorizationMiddleware;