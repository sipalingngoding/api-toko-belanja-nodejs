const {Router} = require('express');

const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const authenticationMiddleware = require("../middleware/authentication-middleware");

const categoryController = new (require('../controller/category-controller'));

const categoryRouter = Router();

categoryRouter.use(authenticationMiddleware);

categoryRouter.use(authorizationMiddleware);

categoryRouter.get('/',categoryController.getAll);

categoryRouter.post('/',categoryController.add);

categoryRouter.patch('/:categoryId',categoryController.update);

categoryRouter.delete("/:categoryId",categoryController.delete);

module.exports = categoryRouter;