const productService = new (require('../service/product-service'));

class ProductController{
    async getAll(req,res,next){
        try {
            const products = await productService.getAll();
            return res.json({
                status : 'success',
                data : {
                    products,
                },
            });
        }catch (e) {
            next(e);
        }
    }

    async add(req,res,next){
        try {
            const id = await productService.add(req.body);
            return res.status(201).json({
                status : 'success',
                data : {
                    id,
                },
            })
        }catch (e) {
            next(e);
        }
    }

    async update(req,res,next){
        try {
            await productService.update({...req.body,productId : req.params.productId});
            return res.json({
                status : 'success',
                message : 'update product success',
            });
        }catch (e){
            next(e);
        }
    }

    async updateCategory(req,res,next){
        try{
            await productService.updateCategory({productId : req.params.productId,categoryId: req. body.categoryId});
            return res.json({
                status :  'success',
                message : 'update category product success',
            });
        }catch (e) {
            next(e);
        }
    }

    async delete(req,res,next){
        try{
            await productService.delete(req.params.productId);
            return res.json({
                status : 'success',
                message : 'delete product success',
            });
        }catch (e){
            next(e);
        }
    }
}


module.exports = ProductController;