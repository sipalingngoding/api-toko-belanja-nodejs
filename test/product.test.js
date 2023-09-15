const supertest = require('supertest');

const app = require('../src/app');
const {beforeEach, test, describe, expect, afterAll} = require("@jest/globals");
const {removeProductTest, removeCategoryTest, insertProductTest, insertCategoryTest, lastIdUser, removeUserTest,
    insertUserTest, lastIdCategory, lastProductId
} = require("./util-test");
const Tokenize = require("../src/utils/tokenize");

let token1,token2 = null;

let newProduct  = null;

beforeEach(async ()=>{
    await removeProductTest();
    await removeCategoryTest();
    await removeUserTest();
    await insertUserTest();
    await insertCategoryTest();
    await insertProductTest();
    token1 = Tokenize.createToken(await lastIdUser()-1);
    token2 = Tokenize.createToken(await lastIdUser());
    newProduct = {
         title : 'Mackbook',price : 10000000, stock: 10,categoryId : await lastIdCategory()
     };
});

describe('GET /products', () => {
    test('get product success',async ()=>{
        const response = await supertest(app)
            .get('/products')
            .set('Authorization',token1);
        expect(response.status).toBe(200);
        expect(response.body.data.products).toHaveLength(2);
    });

    test('get product fail, empty token',async ()=>{
        const response = await supertest(app)
            .get('/products')
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });


    test('get product fail, token wrong',async ()=>{
        const response = await supertest(app)
            .get('/products')
            .set('Authorization','salah')
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('get product fail, forbidden',async ()=>{
        const response = await supertest(app)
            .get('/products')
            .set('Authorization',token2)
        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/Forbidden/i);
    });
});

describe('POST /products', () => {
    test('add product success',async ()=>{
        const response = await supertest(app)
            .post('/products')
            .set('Authorization',token1)
            .send(newProduct)
        expect(response.status).toBe(201);
        expect(response.body.data.id).toBe(await lastProductId());
    });
    test('add product fail, category not found',async ()=>{
        const response = await supertest(app)
            .post('/products')
            .set('Authorization',token1)
            .send({...newProduct,categoryId: await lastIdCategory()+1})
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/category id not found/i)
    });
    test('add product fail, invalid input',async ()=>{
        const response = await supertest(app)
            .post('/products')
            .set('Authorization',token1)
            .send({...newProduct,title : 'mac'})
        expect(response.status).toBe(400);
        expect(response.body.message).not.toBe('');
    });

    test('add product fail, empty token',async ()=>{
        const response = await supertest(app)
            .post('/products')
            // .set('Authorization',token1)
            .send(newProduct)
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i)
    });

    test('add product fail, token wrong',async ()=>{
        const response = await supertest(app)
            .post('/products')
            .set('Authorization','wrong')
            .send(newProduct)
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i)
    });


    test('add product fail, forbidden',async ()=>{
        const response = await supertest(app)
            .post('/products')
            .set('Authorization',token2)
            .send(newProduct)
        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/forbidden/i)
    });
});

describe('PUT /products/:productId', () => {
    test('update product success',async ()=>{
        const response = await supertest(app)
            .put(`/products/${await lastProductId()}`)
            .set('Authorization',token1)
            .send({title : 'Macbook'})
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/update product success/i);
    });

    test('update product fail, product not found',async ()=>{
        const response = await supertest(app)
            .put(`/products/${await lastProductId()+1}`)
            .set('Authorization',token1)
            .send({title : 'Macbook'})
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/product not found/i);
    });

    test('update product fail, invalid input',async ()=>{
        const response = await supertest(app)
            .put(`/products/${await lastProductId()}`)
            .set('Authorization',token1)
            .send({title : 'Mac'})
        expect(response.status).toBe(400);
        expect(response.body.message).not.toBe('');
    });

    test('update product fail, no token',async ()=>{
        const response = await supertest(app)
            .put(`/products/${await lastProductId()}`)
            // .set('Authorization',token1)
            .send({title : 'Macbook'})
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('update product fail, wrong token',async ()=>{
        const response = await supertest(app)
            .put(`/products/${await lastProductId()}`)
            .set('Authorization','wrong')
            .send({title : 'Macbook'})
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('update product fail, forbidden',async ()=>{
        const response = await supertest(app)
            .put(`/products/${await lastProductId()}`)
            .set('Authorization',token2)
            .send({title : 'Macbook'})
        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/Forbidden/i);
    })
});

describe('PATCH /products/:productId', () => {
    test('update category product success',async ()=>{
        const response = await supertest(app)
            .patch(`/products/${await lastProductId()}`)
            .set('Authorization',token1)
            .send({categoryId: await lastIdCategory()-1})
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/update category product success/i);
    });

    test('update category product fail, not found product',async ()=>{
        const response = await supertest(app)
            .patch(`/products/${await lastProductId()+1}`)
            .set('Authorization',token1)
            .send({categoryId: await lastIdCategory()-1})
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/product not found/i);
    });

    test('update category product fail, not found category',async ()=>{
        const response = await supertest(app)
            .patch(`/products/${await lastProductId()}`)
            .set('Authorization',token1)
            .send({categoryId: await lastIdCategory()+1})
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/category not found/i);
    });

    test('update category product fail, no token',async ()=>{
        const response = await supertest(app)
            .patch(`/products/${await lastProductId()}`)
            // .set('Authorization',toke)
            .send({categoryId: await lastIdCategory()-1})
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('update category product fail, token wrong',async ()=>{
        const response = await supertest(app)
            .patch(`/products/${await lastProductId()}`)
            .set('Authorization','dsds')
            .send({categoryId: await lastIdCategory()-1})
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('update category product fail, forbidden',async ()=>{
        const response = await supertest(app)
            .patch(`/products/${await lastProductId()}`)
            .set('Authorization',token2)
            .send({categoryId: await lastIdCategory()-1})
        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/forbidden/i);
    });

});


describe('delete /products/:productId', () => {
    test('delete product success',async ()=>{
        const response = await supertest(app)
            .delete(`/products/${await lastProductId()}`)
            .set('Authorization',token1)
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/delete product success/i);
    });

    test('delete product fail, not found product',async ()=>{
        const response = await supertest(app)
            .delete(`/products/${await lastProductId()+1}`)
            .set('Authorization',token1)
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/product not found/i);
    });


    test('delete  product fail, no token',async ()=>{
        const response = await supertest(app)
            .delete(`/products/${await lastProductId()}`)
            // .set('Authorization',toke)
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('delete product fail, token wrong',async ()=>{
        const response = await supertest(app)
            .delete(`/products/${await lastProductId()}`)
            .set('Authorization','dsds')
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('delete product fail, forbidden',async ()=>{
        const response = await supertest(app)
            .patch(`/products/${await lastProductId()}`)
            .set('Authorization',token2)
        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/forbidden/i);
    });

});