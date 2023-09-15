const express = require('express');

const ErrorMiddleware = require("./middleware/error-middleware");
const {categoryRoute,userRoute,productRoute,transactionRoute} = require("./routes");

const app = express();

app.use(express.json());

app.use('/users',userRoute);

app.use('/categories',categoryRoute);

app.use('/products',productRoute);

app.use('/transactions',transactionRoute);

app.use(ErrorMiddleware);

app.use((req,res)=>{
    return res.status(404).json({
        status : 'fail',
        message : 'Route Not Found',
    });
});

module.exports = app;
