const {describe, test, beforeEach, expect} = require("@jest/globals");

const {insertUserTest,removeUserTest,lastIdUser} = require('./util-test');

const Tokenize= require('../src/utils/tokenize');

beforeEach(async ()=>{
    await removeUserTest();
    await insertUserTest();
});

describe('Test Create Token', ()=>{
    test('Create token success',async ()=>{
        const lastId = await lastIdUser();
        const token = Tokenize.createToken(lastId);
        expect(token).not.toBe('');
    })
});

describe('Test verify token',()=>{
    test('verify token success',async ()=>{
        const token = Tokenize.createToken(await lastIdUser());
        const decoded = Tokenize.verifyToken(token);
        expect(decoded.id).toBe(await lastIdUser());
    })

    test('verify token fail, invalid token',async ()=>{
        expect(()=>{
            Tokenize.verifyToken('dsds');
        }).toThrow();
    });
});