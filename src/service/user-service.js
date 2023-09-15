const bcrypt = require('bcrypt');

const {User} = require('../db/models');
const ClientError = require("../error/client-error");
const Tokenize = require("../utils/tokenize");
const {userLoginSchema} = require("../validator/user");
const validate = require("../validator/validate");
const NotFoundError = require("../error/not-found-error");
class UserService{
    getByEmail(email){
        return User.findOne({
            where : {email}
        });
    }

    getById(id){
        return User.findByPk(id);
    };

    async register({fullName,email,password,gender}){
        // const checkUser = await this.getByEmail(email);
        // if(checkUser) throw new ClientError('email already exist');
        const user = await User.create({
            fullName,email, password, gender, role : 'customer', balance : 0,
        });
        return user.id;
    }

    async login({email,password}){
        validate(userLoginSchema(),{email,password});
        const user = await this.getByEmail(email);
        if(!user) throw new ClientError('email or password is wrong');
        const checkPw = bcrypt.compareSync(password,user.password);
        if(!checkPw) throw new ClientError('email or password is wrong');
        return Tokenize.createToken(user.id);
    }

    async update({userId,fullName,email}){
        const user = await this.getById(userId);
        if(!user) throw new NotFoundError('user not found');
        if(fullName === null) fullName = user.fullName;
        if(email === null) email = user.email;

        await User.update({
            fullName,email,
        },{
            where : {id : userId}
        });
        return true;
    }

    async delete(userId){
        const user = await this.getById(userId);
        if(!user) throw new NotFoundError('user not found');
        await User.destroy({
            where : {id :userId},
        })
        return true;
    }

    async topUp(userId,balance){
        const user = await this.getById(userId);
        if(!user) throw new NotFoundError('user not found');
        await User.update({
            balance : balance + user.balance,
        },{
            where : {id: userId},
        })
        return balance + user.balance;
    }
}


module.exports = UserService;