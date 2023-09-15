const {describe, beforeEach, test, expect} = require("@jest/globals");

const {insertUserTest,removeUserTest, lastIdUser, AllUsers} = require('../util-test');
const ClientError = require("../../src/error/client-error");
const {ValidationError} = require("sequelize");
const NotFoundError = require("../../src/error/not-found-error");

const userService  = new (require('../../src/service/user-service'));

beforeEach(async ()=>{
    await removeUserTest();
    await insertUserTest();
});

const newUser = {
    fullName : 'Budiman Aja', email :'budiman@gmail.com',password : 'Budiman123?',gender :'male',
};

describe('Test find By Email',()=>{
    test('find user success',async ()=>{
        const user = await userService.getByEmail('diory@gmail.com');
        expect(user).not.toBeNull();
        expect(user).toHaveProperty('fullName','Diory Pribadi Sinaga');
    });

    test('find user fail',async ()=>{
        expect(await userService.getByEmail('admin@gmail.com')).toBeNull();
    });
});

describe('Test find By Id',()=>{
    test('find user success',async ()=>{
        const user = await userService.getById(await lastIdUser()-1);
        expect(user).not.toBeNull();
        expect(user).toHaveProperty('fullName','Diory Pribadi Sinaga');
    });

    test('find user fail',async ()=>{
        expect(await userService.getById(await lastIdUser()+1)).toBeNull();
    });
});

describe('Test register', () => {
    test('register user success',async ()=>{
        const id = await userService.register(newUser);
        expect(id).toBe(await lastIdUser());
        const users = await AllUsers();
        expect(users).toHaveLength(3);
        expect(users[2]).toHaveProperty('fullName','Budiman Aja');
        expect(users[2]).toHaveProperty('email','budiman@gmail.com');
        expect(users[2]).toHaveProperty('gender','male');
    });

    test('register user fail, invalid input',async ()=>{
        try{
            await userService.register({...newUser,password : 'Ss'});
        }catch (err){
            expect(err).toBeInstanceOf(ValidationError);
            expect(err.message).toMatch(/Password minimal 8 karakter, memuat huruf besar, number, dan karakter khusus/i);
        }
    });

    test('register user fail, email already',async ()=>{
        await userService.register(newUser);
        await expect(userService.register(newUser)).rejects.toThrow();
        const users =await AllUsers();
        expect(users).toHaveLength(3);
    });
});

describe('Test login user', () => {
    test('user login success',async ()=>{
        const token =await userService.login({email : 'diory@gmail.com', password : 'Diory123?'});
        expect(token).not.toBe('');
    });

    test('user login fail,invalid input',async ()=>{
        await expect(userService.login({email : 'dsds'})).rejects.toThrow(ClientError);
    });

    test('user login fail, email wrong',async ()=>{
        await expect(userService.login({email : 'diory1@gmail',password: 'Diory123?'})).rejects.toThrow(ClientError)
    });

    test('user login fail, password wrong',async ()=>{
        await expect(userService.login({email : 'diory@gmail',password: 'salah'})).rejects.toThrow(ClientError)
    });
});

describe('Test update user', () => {
    test('update user success',async ()=>{
       await expect(userService.update({userId : await lastIdUser()-1,fullName :'Diory Aja'})).resolves.toBeTruthy();
       const user = await userService.getById(await lastIdUser()-1);
       expect(user).toHaveProperty('fullName','Diory Aja');
       expect(user).toHaveProperty('email','diory@gmail.com');
    });
    test('update user success sample 2',async ()=>{
       await expect(userService.update({userId : await lastIdUser()-1,email :'pribadi@gmail.com'})).resolves.toBeTruthy();
       const user = await userService.getById(await lastIdUser()-1);
       expect(user).toHaveProperty('fullName','Diory Pribadi Sinaga');
       expect(user).toHaveProperty('email','pribadi@gmail.com');
    });

    test('update fail, user not found',async ()=>{
        await expect(userService.update({userId : await lastIdUser()+1,email :'pribadi@gmail.com'})).rejects.toThrow(NotFoundError);
    });
});


describe('Test delete user',()=>{
    test('delete user success',async ()=>{
        const lastId = await lastIdUser();
        const result = await userService.delete(lastId);
        expect(result).toBeTruthy();
        await expect(userService.getById(lastId)).resolves.toBeNull();
    })

    test('delete user fail, user not found',async ()=>{
        await expect(userService.delete(await lastIdUser()+1)).rejects.toThrow(NotFoundError);
    });
});

describe('Test update balance',()=>{
    test('update balance success',async ()=>{
        await expect(userService.topUp(await lastIdUser(),100000)).resolves.toBe(100000);
        await expect(userService.topUp(await lastIdUser(),100000)).resolves.toBe(200000);
        const user = await userService.getById(await lastIdUser());
        expect(user).toHaveProperty('balance',200000);
    });

    test('update balance fail, invalid input',async ()=>{
        await expect(userService.topUp(await lastIdUser(),'ds')).rejects.toThrow();
        const user = await userService.getById(await lastIdUser());
        expect(user).toHaveProperty('balance',0);
    });
});