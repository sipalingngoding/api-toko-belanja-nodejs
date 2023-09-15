const {describe, beforeEach, test, expect} = require("@jest/globals");
const {
    removeTransactionTest,
    removeProductTest,
    removeCategoryTest,
    removeUserTest,
    insertUserTest,
    insertCategoryTest,
    insertProductTest,
    lastProductId, lastIdUser,
    lastIdCategory,
    lastTransactionTest
} = require("../util-test");
const NotFoundError = require("../../src/error/not-found-error");


const transactionHistoryService = new (require('../../src/service/transaction-service'));
const userService = new (require('../../src/service/user-service'));
const productService = new (require('../../src/service/product-service'));
const categoryService = new (require('../../src/service/categories-service'));

beforeEach(async ()=>{
    await removeProductTest();
    await removeCategoryTest();
    await removeUserTest();
    await removeTransactionTest();
    await insertUserTest();
    await insertCategoryTest();
    await insertProductTest();
});

describe('Test add transaction', () => {
    test('add transaction success',async ()=>{
        await userService.topUp(await lastIdUser(),100000);

        const id = await transactionHistoryService.add({
            productId : await lastProductId()-1, userId : await lastIdUser(),quantity : 5,
        });

        expect(id).toBe(await lastTransactionTest());

        const product = await productService.getByPk(await lastProductId()-1);
        expect(product).toHaveProperty('stock',1);

        const user = await userService.getById(await lastIdUser());
        expect(user).toHaveProperty('balance',50000);

        const category = await categoryService.getById(await lastIdCategory()-1);
        expect(category).toHaveProperty('sold_product_amount',5);

    });

    test('add transaction fail, not found product',async ()=>{
        await expect(transactionHistoryService.add({
            productId : await lastProductId()+1, userId : await lastIdUser(),quantity : 5,
        })).rejects.toThrow(NotFoundError);
    });

    test('add transaction fail, quantity > stock',async ()=>{
        await userService.topUp(await lastIdUser(),100000);
        try{
            await transactionHistoryService.add({productId : await lastProductId()-1,quantity:7,userId: await lastIdUser()})
        }catch (e){
            expect(e.message).toBe('quantity melebihi stock barang')
        }
    });

    test('add transaction fail, money is not enough',async ()=>{
        await userService.topUp(await lastIdUser(),50000);
        try{
            await transactionHistoryService.add({productId : await lastProductId()-1,quantity:6,userId: await lastIdUser()})
        }catch (e){
            expect(e.message).toBe('your money is not enough')
        }
    });
});


describe('Test get transaction user', () => {
    test('get transaction user success',async ()=>{
        await userService.topUp(await lastIdUser(),50000);
        await transactionHistoryService.add({
            productId : await lastProductId()-1, userId : await lastIdUser(),quantity : 5,
        });
        const transactionHistories = await transactionHistoryService.getTransactionUser(await lastIdUser());
        expect(transactionHistories).toHaveLength(1);
        const transaction = transactionHistories[0];
        expect(transaction).toHaveProperty('quantity',5)
        expect(transaction).toHaveProperty('totalPrice',50000)
        expect(transaction).toHaveProperty('productId',await lastProductId()-1)
        expect(transaction).toHaveProperty('userId',await lastIdUser())
        expect(transaction).toHaveProperty('Product');
        const product = transaction.Product;
        expect(product).toHaveProperty('title','Makaroni');
        expect(product).toHaveProperty('price',10000);
        expect(product).toHaveProperty('stock',1);
        expect(product).toHaveProperty('categoryId',await lastIdCategory()-1);
    });
});

describe('Test get transaction users role admin', () => {
    beforeEach(async ()=>{
        await userService.register({fullName : 'Yuma nur alfat',email :'yuma@gmail.com',password : 'Yuma123?',gender : 'male'});
        await userService.topUp(await lastIdUser(),50000000);
        await userService.topUp(await lastIdUser()-1,50000);
        await transactionHistoryService.add({
            productId : await lastProductId()-1, userId : await lastIdUser()-1,quantity : 5,
        });
        await transactionHistoryService.add({
            productId : await lastProductId(), userId : await lastIdUser(),quantity : 2,
        });
    });
    test('get transaction all user success',async ()=>{
        const transactionHistories = await transactionHistoryService.getTransactionAdmin();
        expect(transactionHistories).toHaveLength(2);
        const transaction = transactionHistories[0];
        expect(transaction).toHaveProperty('quantity',5)
        expect(transaction).toHaveProperty('totalPrice',50000)
        expect(transaction).toHaveProperty('productId',await lastProductId()-1)
        expect(transaction).toHaveProperty('userId',await lastIdUser()-1)
        expect(transaction).toHaveProperty('Product');
        const product = transaction.Product;
        expect(product).toHaveProperty('title','Makaroni');
        expect(product).toHaveProperty('price',10000);
        expect(product).toHaveProperty('stock',1);
        expect(product).toHaveProperty('categoryId',await lastIdCategory()-1);

        expect(transaction).toHaveProperty('User');
        const user = transaction.User;
        expect(user).toHaveProperty('email','siska@gmail.com');
        expect(user).toHaveProperty('gender','female');
        expect(user).toHaveProperty('balance',0);
    });

    test('get transaction By transactionId success',async ()=>{
        const transaction = await transactionHistoryService.getTransactionId(await lastTransactionTest());
        expect(transaction).not.toBeNull();

        expect(transaction).toHaveProperty('quantity',2)
        expect(transaction).toHaveProperty('totalPrice',16000000)
        expect(transaction).toHaveProperty('productId',await lastProductId())
        expect(transaction).toHaveProperty('userId',await lastIdUser())
        expect(transaction).toHaveProperty('Product');
        const product = transaction.Product;
        expect(product).toHaveProperty('title','Laptop');
        expect(product).toHaveProperty('price',8000000);
        expect(product).toHaveProperty('stock',6);
        expect(product).toHaveProperty('categoryId',await lastIdCategory());

        expect(transaction).toHaveProperty('User');
        const user = transaction.User;
        expect(user).toHaveProperty('email','yuma@gmail.com');
        expect(user).toHaveProperty('gender','male');
        expect(user).toHaveProperty('balance',34000000);
    });
});

