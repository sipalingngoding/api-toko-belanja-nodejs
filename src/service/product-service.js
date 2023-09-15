const {Product,Category} = require('../db/models');
const NotFoundError = require("../error/not-found-error");
const {ValidationError} = require("sequelize");

class ProductService{
    getAll(){
        return Product.findAll();
    }

    async getByPk(id){
        const product = await  Product.findByPk(id);
        if(!product) throw new NotFoundError('product not found');
        return product;
    }

    async add({title,price,stock,categoryId}){
        const category = await Category.findByPk(categoryId);
        if(!category) throw new NotFoundError('Category id not found');
        if(stock < 5) throw new ValidationError('Stock tidak boleh kurang dari 5');
        const product = await Product.create({
            title,price,stock,categoryId,
        });
        return product.id;
    }

    async update({price,stock,title,productId}){
        const product = await Product.findByPk(productId);
        if(!product) throw new NotFoundError('product not found');
        if(price === null) price = product.price;
        if(stock === null) stock = product.stock;
        if(title === null) title = product.title;

        if(stock < 0 ) throw new ValidationError('stock tidak boleh negatif');

        await Product.update({
            price,title,stock
        },{
            where : {id : productId}
        });

        return true;
    }

    async updateCategory({productId,categoryId}){
        await this.getByPk(productId);
        const category = await Category.findByPk(categoryId);
        if(!category) throw new NotFoundError('category not found');
        await Product.update({
            categoryId,
        },{
            where : {id: productId},
        })

        return true;
    }


    async delete(productId){
        await this.getByPk(productId);
        await Product.destroy({
            where : {id: productId}
        })
        return true;
    }

}

module.exports = ProductService;