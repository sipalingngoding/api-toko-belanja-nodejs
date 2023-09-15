const jwt = require('jsonwebtoken');

class Tokenize{
    static createToken(id){
        return jwt.sign({id},process.env.SECRET_KEY,{expiresIn: '1h'});
    }

    static verifyToken(token){
        return jwt.verify(token, process.env.SECRET_KEY);
    }
}

module.exports = Tokenize;