const {Router} = require('express');
const authenticationMiddleware = require("../middleware/authentication-middleware");

const userRouter = Router();

const userController = new (require('../controller/user-controller'));

userRouter.post('/register',userController.register);

userRouter.post('/login',userController.login);

userRouter.use(authenticationMiddleware);

userRouter.put('/',userController.update);

userRouter.delete('/',userController.delete);

userRouter.patch('/topup',userController.topUp);

module.exports = userRouter;