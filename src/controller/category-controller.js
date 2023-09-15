const categoryService = new (require('../service/categories-service'));
class CategoryController{
    async getAll(req,res,next){
        try{
            const categories = await categoryService.getAll();
            return res.json({
                status  : 'success',
                data : {
                    categories,
                },
            })
        }catch (e) {
            next(e);
        }
    }

    async add(req,res,next){
        try{
            const id = await categoryService.addCategory(req.body);
            return res.status(201).json({
                status : 'success',
                data : {
                    id,
                },
            });
        }catch (e) {
            next(e);
        }
    }

    async update(req,res,next){
        try{
            await categoryService.update({categoryId : req.params.categoryId,type:req.body.type});
            return res.json({
                status : 'success',
                message : 'update category success',
            });
        }catch (e) {
            next(e);
        }
    }

    async delete(req,res,next){
        try{
            await categoryService.delete(req.params.categoryId);
            return res.json({
                status : 'success',
                message : 'delete category success',
            });
        }catch (e) {
            next(e)
        }
    }
}


module.exports = CategoryController;