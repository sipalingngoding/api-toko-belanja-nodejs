const userService = new (require('../service/user-service'));

const createRp = require('../utils/Rp');

class UserController{
    async register(req,res,next){
        try {
            const id = await userService.register(req.body);
            return res.status(201).json({
                status : 'success',
                message : 'register user success',
                data : {
                    id,
                }
            });
        }catch (e) {
            next(e);
        }
    }

    async login(req,res,next){
        try{
            const token = await userService.login(req.body);
            return res.json({
                status : 'success',
                data : {
                    token,
                }
            })
        }catch (e) {
            next(e);
        }
    }


    async update(req,res,next){
        try{
            await userService.update({userId : req.userId,...req.body})
            return res.json({
                status : 'success',
                message : 'update user success',
            })
        }catch (e) {
            next(e);
        }
    }
    async delete(req,res,next){
        try{
            await userService.delete(req.userId);
            return res.json({
                status : 'success',
                message : 'delete user success',
            })
        }catch (e) {
            next(e);
        }
    }

    async topUp(req,res,next){
        try{
            const balance =  await userService.topUp(req.userId,req.body.balance);
            return res.json({
                status :'success',
                data : {
                    balance : createRp(balance),
                },
            });
        }catch (e) {
            next(e);
        }
    }
}

module.exports = UserController;