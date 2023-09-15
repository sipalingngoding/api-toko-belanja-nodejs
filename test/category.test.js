const supertest = require('supertest');
const {describe, beforeEach, test, expect} = require("@jest/globals");

const {removeUserTest, removeCategoryTest, insertUserTest, insertCategoryTest, lastIdUser, lastIdCategory,
    removeProductTest, insertProductTest
} = require("./util-test");

const app = require('../src/app');
const Tokenize = require("../src/utils/tokenize");
let token1,token2  =  null;

beforeEach(async ()=>{
    await removeProductTest();
    await removeUserTest();
    await removeCategoryTest();
    await insertUserTest();
    await insertCategoryTest();
    await insertProductTest();
    token1 = Tokenize.createToken(await lastIdUser()-1);
    token2 = Tokenize.createToken(await lastIdUser())
});


describe('GET /categories', () => {
    test('get categories success',async ()=>{
        const response = await supertest(app)
            .get('/categories')
            .set('Authorization',token1)
        expect(response.status).toBe(200);
        const categories = response.body.data.categories;
        expect(categories).toHaveLength(2);
        expect(categories[0]).toHaveProperty('type','Makanan');
        expect(categories[1]).toHaveProperty('type','Elektronik');
    });

    test('get categories fail, not token',async ()=>{
        const response = await supertest(app)
            .get('/categories')
            // .set('Authorization',token1)
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('get categories fail, token wrong',async ()=>{
        const response = await supertest(app)
            .get('/categories')
            .set('Authorization','dsdsfd')
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('get categories fail,forbidden',async ()=>{
        const response = await supertest(app)
            .get('/categories')
            .set('Authorization',token2)
        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/Forbidden/i);
    });
});


describe('POST /categories', () => {
    test('add categories success',async ()=>{
        const response = await supertest(app)
            .post('/categories')
            .set('Authorization',token1)
            .send({type : 'Kendaraan'})
        expect(response.status).toBe(201);
        expect(response.body.data.id).toBe(await lastIdCategory());
    });

    test('add categories fail, invalid input',async ()=>{
        const response = await supertest(app)
            .post('/categories')
            .set('Authorization',token1)
            .send({type : 'Kes'})
        expect(response.status).toBe(400);
        expect(response.body.message).not.toBe('');
    });

    test('post categories fail, not token',async ()=>{
        const response = await supertest(app)
            .post('/categories')
        // .set('Authorization',token1)
            .send({type : 'Kes'})
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('post categories fail, token wrong',async ()=>{
        const response = await supertest(app)
            .post('/categories')
            .set('Authorization','dsdsfd')
            .send({type : 'Kes'})
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('post categories fail,forbidden',async ()=>{
        const response = await supertest(app)
            .get('/categories')
            .set('Authorization',token2)
            .send({type : 'Kendaraan'})
        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/Forbidden/i);
    });
});

describe('PATCH /categories/categoryId', () => {
    test('Update category success',async ()=>{
        const response = await supertest(app)
            .patch(`/categories/${await lastIdCategory()-1}`)
            .set('Authorization',token1)
            .send({type : 'Kendaraan'})
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/update category success/i);
    });

    test('Update category fail, invalid input',async ()=>{
        const response = await supertest(app)
            .patch(`/categories/${await lastIdCategory()-1}`)
            .set('Authorization',token1)
            .send({type : 'Ken'})
        expect(response.status).toBe(400);
        expect(response.body.message).not.toBe('');
    });

    test('Update category fail, category not found',async ()=>{
        const response = await supertest(app)
            .patch(`/categories/${await lastIdCategory()+1}`)
            .set('Authorization',token1)
            .send({type : 'Ken'})
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/category not found/i);
    });

    test('update categories fail, not token',async ()=>{
        const response = await supertest(app)
            .patch('/categories/'+await lastIdCategory())
            // .set('Authorization',token1)
            .send({type : 'Kendaraan'})
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
    test('update categories fail, wrong token',async ()=>{
        const response = await supertest(app)
            .patch('/categories/'+await lastIdCategory())
            .set('Authorization','dsds')
            .send({type : 'Kendaraan'})
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('update categories fail, forbidden',async ()=>{
        const response = await supertest(app)
            .patch('/categories/'+await lastIdCategory())
            .set('Authorization',token2)
            .send({type : 'Kendaraan'})
        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/forbidden/i);
    });
});

describe('DELETE /categories/categorId', () => {
    test('delete category success',async ()=>{
        const response = await supertest(app)
            .delete(`/categories/${await lastIdCategory()}`)
            .set('Authorization',token1)
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/delete category success/i);
    });

    test('delete category fail, not found',async ()=>{
        const response = await supertest(app)
            .delete(`/categories/${await lastIdCategory()+1}`)
            .set('Authorization',token1)
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/category not found/i);
    });

    test('delete category fail, not token',async ()=>{
        const response = await supertest(app)
            .delete(`/categories/${await lastIdCategory()}`)
            // .set('Authorization',token1)
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('delete category fail, wrong token',async ()=>{
        const response = await supertest(app)
            .delete(`/categories/${await lastIdCategory()}`)
            .set('Authorization','salah')
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('delete category fail, forbidden',async ()=>{
        const response = await supertest(app)
            .delete(`/categories/${await lastIdCategory()}`)
            .set('Authorization',token2)
        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/forbidden/i);
    });

});