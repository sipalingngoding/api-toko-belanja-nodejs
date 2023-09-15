const {Router} = require('express');
const authenticationMiddleware = require("../middleware/authentication-middleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const transactionRouter = Router();

const transactionController = new (require('../controller/transaction-controller'));

transactionRouter.use(authenticationMiddleware);

transactionRouter.post('/',transactionController.add);

transactionRouter.get('/user',transactionController.getTransactionUser);

transactionRouter.use(authorizationMiddleware);

transactionRouter.get('/admin',transactionController.getTransactionAdmin);

transactionRouter.get('/:transactionId',transactionController.getTransactionOne);


module.exports = transactionRouter;