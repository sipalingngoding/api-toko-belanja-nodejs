const {Product,User,TransactionHistory, Category} = require('../db/models');
const NotFoundError = require("../error/not-found-error");
const ClientError = require("../error/client-error");

class TransactionService{
    async add({productId, quantity,userId}){
        const product = await Product.findByPk(productId);
        if(!product) throw new  NotFoundError('product not found');
        const checkStock = quantity > product.stock;
        if(checkStock) throw new ClientError('quantity melebihi stock barang');

        const user = await User.findByPk(userId);
        const totalPrice = quantity * product.price;
        const checkBalanceUser = user.balance >= totalPrice;
        if(!checkBalanceUser) throw new ClientError('your money is not enough');

        //Update stock product
        await Product.update({
            stock : (product.stock-quantity),
        },{
            where : {id: productId},
        })

        //Update balance user
        await User.update({
            balance : (user.balance - totalPrice),
        },{
            where : {id : userId}
        })

        const category = await Category.findByPk(product.categoryId);

        //Update category
        await Category.update({
            sold_product_amount: (category.sold_product_amount + quantity),
        },{
            where : {id: category.id}
        })

        //Add transaction;
        const transaction  = await TransactionHistory.create({
            productId,userId,quantity,totalPrice
        });
        return transaction.id;
    }

    getTransactionUser(userId){
        return TransactionHistory.findAll({
            where : {userId}, include : {
                model : Product,attributes : ['id','title','price','stock','categoryId']
            }
        })
    }

    getTransactionAdmin(){
        return TransactionHistory.findAll({
            include :[ {
                model : Product,attributes : ['id','title','price','stock','categoryId']
            },{
                model : User,attributes : ['id','email','balance','gender','role']
            }]
        })
    }

    getTransactionId(transactionId){
        return TransactionHistory.findByPk(transactionId,{
            include :[ {
                model : Product,attributes : ['id','title','price','stock','categoryId']
            },{
                model : User,attributes : ['id','email','balance','gender','role']
            }]
        });
    }
}


module.exports = TransactionService;