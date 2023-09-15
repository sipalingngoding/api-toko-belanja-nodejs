const {Router} = require('express');
const authenticationMiddleware = require("../middleware/authentication-middleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const productController = new (require('../controller/product-controller'));

const productRouter = Router();

productRouter.use(authenticationMiddleware);

productRouter.use(authorizationMiddleware);

productRouter.get('/',productController.getAll);

productRouter.post('/',productController.add);

productRouter.put('/:productId',productController.update);

productRouter.patch('/:productId',productController.updateCategory);

productRouter.delete('/:productId',productController.delete);

module.exports = productRouter;
