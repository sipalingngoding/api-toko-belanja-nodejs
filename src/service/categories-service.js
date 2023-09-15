const {Category} = require('../db/models');
const NotFoundError = require("../error/not-found-error");

class CategoriesService{

    async getAll(){
        return Category.findAll();
    }

    async getById(id){
        return Category.findByPk(id);
    }
    async addCategory({type}){
        const category = await Category.create({
            type, sold_product_amount: 0,
        });
        return category.id;
    }

    async update({categoryId,type}){
        if(!await this.getById(categoryId)) throw new NotFoundError('category not found');
        await Category.update({
            type
        },{
            where : {id: categoryId},
        });
        return true;
    }

    async delete(categoryId){
        if(!await this.getById(categoryId)) throw new NotFoundError('category not found');
        await Category.destroy({
            where : {id: categoryId},
        });
        return true;
    }
}

module.exports = CategoriesService;