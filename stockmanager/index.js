const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const userRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');
const billingRoute = require('./routes/billing');
const dashboardRoute = require('./routes/dashboard');
const contactRoute = require('./routes/contact');
const app = express();

app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use('/user', userRoute);
app.use('/category',categoryRoute);
app.use('/product', productRoute);
app.use('/billing', billingRoute);
app.use('/dashboard', dashboardRoute);
app.use('/contact', contactRoute);

module.exports = app;
