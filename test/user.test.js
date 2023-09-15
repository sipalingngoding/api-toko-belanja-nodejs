const {describe, beforeEach, test, expect} = require("@jest/globals");
const supertest = require('supertest');

const app = require('../src/app');
const {insertUserTest,removeUserTest, lastIdUser, AllUsers} = require('./util-test');
const Tokenize = require("../src/utils/tokenize");

let token = null;

beforeEach(async ()=>{
    await removeUserTest();
    await insertUserTest();
    token = Tokenize.createToken(await lastIdUser());
});

const newUser = {
    fullName : 'Budiman Aja', email :'budiman@gmail.com',password : 'Budiman123?',gender :'male',
};


describe('POST /users/register',()=>{
    test('Register success',async ()=>{
        const response = await supertest(app)
            .post('/users/register')
            .set('Content-Type','application/json')
            .send(newUser)
        expect(response.status).toBe(201);
        expect(response.body.data.id).toBe(await lastIdUser());
    });

    test('Register fail, invalid input',async ()=>{
        const response = await supertest(app)
            .post('/users/register')
            .set('Content-Type','application/json')
            .send({...newUser,password:  'sasa'});
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/Password minimal 8 karakter, memuat huruf besar, number, dan karakter khusus/i);
    });

    test('register fail, email already exist',async ()=>{
        const response = await supertest(app)
            .post('/users/register')
            .set('Content-Type','application/json')
            .send({...newUser,email: 'diory@gmail.com'});
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/email already exist/i);
    });
});

describe('POST /users/login', () => {
    test('login success',async ()=>{
        const response = await supertest(app)
            .post('/users/login')
            .set('Content-Type','application/json')
            .send({email: 'diory@gmail.com',password: 'Diory123?'});
        expect(response.status).toBe(200);
        expect(response.body.data.token).not.toBe('');
    });

    test('Login fail, invalid input',async ()=>{
        const response = await supertest(app)
            .post('/users/login')
            .set('Content-Type','application/json')
            .send({email: 'diory@gmail.com',password:''});
        expect(response.status).toBe(400);
        expect(response.body.message).not.toBe('');
    });

    test('Login fail, email not found',async ()=>{
        const response = await supertest(app)
            .post('/users/login')
            .set('Content-Type','application/json')
            .send({email: 'salah@gmail.com',password:'Diory123?'});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('email or password is wrong');
    });

    test('Login fail, password wrong',async ()=>{
        const response = await supertest(app)
            .post('/users/login')
            .set('Content-Type','application/json')
            .send({email: 'diory@gmail.com',password:'salah'});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('email or password is wrong');
    });
});

describe('PUT /users', () => {
    test('Update user success',async ()=>{
        const response = await supertest(app)
            .put(`/users`)
            .set('Authorization',token)
            .send({email: 'sinaga@gmail.com'});
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('update user success');
    });
    test('Update user fail, invalid input',async ()=>{
        const response = await supertest(app)
            .put(`/users`)
            .set('Authorization',token)
            .send({email: 'sa'});
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/format email invalid/);
    });
    test('Update user fail, auth empty',async ()=>{
        const response = await supertest(app)
            .put(`/users`)
            // .set('Authorization','salah')
            .send({email: 'diory1@gmail.com'});
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('Update user fail, auth wrong',async ()=>{
        const response = await supertest(app)
            .put(`/users`)
            .set('Authorization','salah')
            .send({email: 'diory1@gmail.com'});
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
});

describe('DELETE /users/:userId', () => {
    test('delete user success',async ()=>{
        const response = await supertest(app)
            .delete(`/users`)
            .set('Authorization',token)
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/delete user success/i);
    });

    test('Delete user fail, auth empty',async ()=>{
        const response = await supertest(app)
            .delete(`/users`)
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('delete user fail, auth wrong',async ()=>{
        const response = await supertest(app)
            .delete(`/users`)
            .set('Authorization','salah')
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
});

describe('PATCH /topup', () => {
    test('topup success',async ()=>{
        const response = await supertest(app)
            .patch('/users/topup')
            .set('Authorization',token)
            .send({balance : 100000})
        expect(response.status).toBe(200);
        expect(response.body.data.balance).toBe('Rp 100.000');
    });

    test('topup user fail, auth wrong',async ()=>{
        const response = await supertest(app)
            .patch(`/users/topup`)
            .set('Authorization','salah')
            .send({balance : 100000})
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('topup user fail, auth empty',async ()=>{
        const response = await supertest(app)
            .patch(`/users/topup`)
            .send({balance : 100000})
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
});