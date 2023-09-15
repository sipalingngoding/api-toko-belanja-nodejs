const {User, Category,Product, TransactionHistory} =require('../src/db/models');

const insertUserTest = async ()=>{
    await User.create({
        fullName : 'Diory Pribadi Sinaga',
        email :'diory@gmail.com',
        password : 'Diory123?',
        gender : 'male',
        role : 'admin',
        balance : 0,
    });
    await User.create({
        fullName : 'Siska Oktaviani',
        email :'siska@gmail.com',
        password : 'Siska123?',
        gender : 'female',
        role : 'customer',
        balance : 0,
    });
};

const removeUserTest = async ()=>{
    await User.destroy({
        truncate : true,
        cascade : true,
    })
};

const lastIdUser = async ()=>{
    const users = await User.findAll({order : [['id','DESC']]});
    return users[0].id;
};

const AllUsers = ()=>{
    return User.findAll();
};

const insertCategoryTest = async ()=>{
    await Category.create({
        type : 'Makanan', sold_product_amount : 0,
    });
    await Category.create({
        type : 'Elektronik', sold_product_amount : 0,
    });
};

const removeCategoryTest = async ()=>{
    await Category.destroy({
        truncate : true,
        cascade : true,
    })
};

const lastIdCategory = async ()=>{
    const categories = await Category.findAll({order : [['id','DESC']]});
    return categories[0].id;
};

const AllCategory = ()=>{
    return Category.findAll();
};

const removeProductTest = async ()=>{
    await Product.destroy({
        truncate : true,
        cascade : true,
    })
};

const insertProductTest = async ()=>{
    await Product.create({
        title : 'Makaroni',price : 10000, stock: 6,categoryId : await lastIdCategory()-1
    });

    await Product.create({
        title : 'Laptop',price : 8000000, stock: 8,categoryId : await lastIdCategory()
    });
};

const lastProductId = async ()=>{
    const products = await Product.findAll({order : [['id','DESC']]});
    return products[0].id;
};

const AllProducts = async ()=>{
    return Product.findAll();
}

const removeTransactionTest = async ()=>{
    await TransactionHistory.destroy({
        truncate : true,
        cascade : true,
    })
};

const lastTransactionTest = async ()=>{
    const transactions = await TransactionHistory.findAll({order : [['id','DESC']]});
    return transactions[0].id;
};

const AllTransactions = ()=>{
    return TransactionHistory.findAll();
};


module.exports = {
    insertUserTest,removeUserTest, lastIdUser, AllUsers, insertCategoryTest,removeCategoryTest,lastIdCategory,AllCategory, removeProductTest, insertProductTest,lastProductId,AllProducts, removeTransactionTest, lastTransactionTest, AllTransactions
}