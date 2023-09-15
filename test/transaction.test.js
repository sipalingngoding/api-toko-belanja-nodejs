const supertest = require('supertest');
const {describe, beforeEach, test, expect} = require("@jest/globals");

const app = require('../src/app');
const {
    removeProductTest,
    removeCategoryTest,
    removeUserTest,
    removeTransactionTest,
    insertUserTest,
    insertCategoryTest,
    insertProductTest, lastIdUser, lastProductId, lastTransactionTest
} = require("./util-test");
const Tokenize = require("../src/utils/tokenize");
const userService = new (require('../src/service/user-service'));

const transactionService = new (require('../src/service/transaction-service'));

let token1,token2 = null;

beforeEach(async ()=>{
    await removeProductTest();
    await removeCategoryTest();
    await removeUserTest();
    await removeTransactionTest();
    await insertUserTest();
    await insertCategoryTest();
    await insertProductTest();
    token1 = Tokenize.createToken(await lastIdUser()-1);
    token2 = Tokenize.createToken(await lastIdUser());
    await userService.topUp(await lastIdUser(),100000);
})

describe('POST /transaction', () => {
    test('add transaction success',async ()=>{
        const response = await supertest(app)
            .post('/transactions')
            .set('Authorization',token2)
            .send({productId : await lastProductId()-1, quantity: 5})
        expect(response.status).toBe(201);
        expect(response.body.data.id).toBe(await lastTransactionTest());
    });

    test('add transaction fail, product not found',async ()=>{
        const response = await supertest(app)
            .post('/transactions')
            .set('Authorization',token2)
            .send({productId : await lastProductId()+1, quantity: 5})
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/product not found/i);
    });

    test('add transaction fail, balance not enough',async ()=>{
        const response = await supertest(app)
            .post('/transactions')
            .set('Authorization',token2)
            .send({productId : await lastProductId(), quantity: 1})
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/your money is not enough/i);
    });

    test('add transaction fail,no token',async ()=>{
        const response = await supertest(app)
            .post('/transactions')
            // .set('Authorization',token2)
            .send({productId : await lastProductId()-1, quantity: 1})
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('add transaction fail, token wrong',async ()=>{
        const response = await supertest(app)
            .post('/transactions')
            .set('Authorization','sdsds')
            .send({productId : await lastProductId()-1, quantity: 1})
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
});

describe('GET /transaction/user', () => {
    beforeEach(async ()=>{
        await transactionService.add({productId: await lastProductId()-1, quantity : 5, userId : await lastIdUser()});
    });
    test('get transaction success',async ()=>{
        const response = await supertest(app)
            .get('/transactions/user')
            .set('Authorization',token2)

        expect(response.status).toBe(200);
        const transactions = response.body.data.transactions;
        expect(transactions).toHaveLength(1);
        expect(transactions[0]).toHaveProperty('quantity',5);
        expect(transactions[0]).toHaveProperty('totalPrice',50000);
        expect(transactions[0]).toHaveProperty('Product');
    });


    test('get transaction fail,no token',async ()=>{
        const response = await supertest(app)
            .get('/transactions/user')
            // .set('Authorization',token2)

        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('get transaction fail,no token',async ()=>{
        const response = await supertest(app)
            .get('/transactions/user')
        .set('Authorization','sdsadasd')

        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
});

describe('GET /transaction/admin', () => {
    beforeEach(async ()=>{
        await userService.register({
            fullName : 'Yuma Nur Alfat',email : 'yuma@gmail.com',password: 'Yuma123?',gender :'male'
        })
        await userService.topUp(await lastIdUser(),20000000);

        await transactionService.add({productId: await lastProductId()-1, quantity : 5, userId : await lastIdUser()-1});

        await transactionService.add({productId: await lastProductId(), quantity : 1, userId : await lastIdUser()});
    });

    test('get transactions admin success',async ()=>{
        const response = await supertest(app)
            .get('/transactions/admin')
            .set('Authorization',token1)
        expect(response.status).toBe(200);
        const {transactions} = response.body.data
        expect(transactions).toHaveLength(2);

        const transaction = transactions[1];
        expect(transaction).toHaveProperty('quantity',1);
        expect(transaction).toHaveProperty('totalPrice',8000000);
        expect(transaction).toHaveProperty('Product');
        expect(transaction).toHaveProperty('User');

        const {User, Product} = transaction;
        expect(User).toHaveProperty('email','yuma@gmail.com');
        expect(Product).toHaveProperty('title','Laptop')
    })

    test('get transaction fail,no token',async ()=>{
        const response = await supertest(app)
            .get('/transactions/admin')
        // .set('Authorization',token2)

        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('get transaction fail, token wrong',async ()=>{
        const response = await supertest(app)
            .get('/transactions/admin')
            .set('Authorization','sdsadasd')

        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('get transaction fail,forbidden',async ()=>{
        const response = await supertest(app)
            .get('/transactions/admin')
            .set('Authorization',token2)

        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/forbidden/i);
    });
});


describe('GET /transaction/:transactionId', () => {
    beforeEach(async ()=>{
        await userService.register({
            fullName : 'Yuma Nur Alfat',email : 'yuma@gmail.com',password: 'Yuma123?',gender :'male'
        })
        await userService.topUp(await lastIdUser(),20000000);

        await transactionService.add({productId: await lastProductId()-1, quantity : 5, userId : await lastIdUser()-1});

        await transactionService.add({productId: await lastProductId(), quantity : 1, userId : await lastIdUser()});
    });

    test('get transaction success',async ()=>{
        const response = await supertest(app)
            .get(`/transactions/${await lastTransactionTest()}`)
            .set('Authorization',token1)
        expect(response.status).toBe(200);
        const transaction = response.body.data.transaction

        expect(transaction).toHaveProperty('quantity',1);
        expect(transaction).toHaveProperty('totalPrice',8000000);
        expect(transaction).toHaveProperty('Product');
        expect(transaction).toHaveProperty('User');

        const {User, Product} = transaction;
        expect(User).toHaveProperty('email','yuma@gmail.com');
        expect(Product).toHaveProperty('title','Laptop')
    })

    test('get transaction fail,no token',async ()=>{
        const response = await supertest(app)
            .get(`/transactions/${await lastTransactionTest()}`)
        // .set('Authorization',token2)

        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('get transaction fail, token wrong',async ()=>{
        const response = await supertest(app)
            .get(`/transactions/${await lastTransactionTest()}`)
            .set('Authorization','sdsadasd')

        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('get transaction fail,forbidden',async ()=>{
        const response = await supertest(app)
            .get(`/transactions/${await lastTransactionTest()}`)
            .set('Authorization',token2)

        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/forbidden/i);
    });
});

