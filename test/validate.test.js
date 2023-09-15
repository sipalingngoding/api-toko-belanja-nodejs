const {describe, test, expect} = require("@jest/globals");


const {userLoginSchema} = require('../src/validator/user');

const validate = require('../src/validator/validate');
const ClientError = require("../src/error/client-error");


describe('Test Validate', () => {
    test('validate success',()=>{
        const value  = validate(userLoginSchema(),{email : 'diory@gmail.com',password : 'Diory123?!'});
        expect(value).toHaveProperty('email','diory@gmail.com');
        expect(value).toHaveProperty('password','Diory123?!');
    });

    test('validate invalid',()=>{
        expect(()=>{
            validate(userLoginSchema(),{email : 'diory@gmail.com'})
        }).toThrow(ClientError);
    });
});