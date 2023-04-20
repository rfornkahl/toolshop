const express = require('express');
const { connect } = require('../connection');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

router.get('/details', auth.authenticationToken,(req,res,next)=>{
    var categoryCount;
    var productCount;
    var billingCount;
    var query = "select count(id) as categoryCount from category";
    connection.query(query,(err,results)=>{
        if(!err){
            categoryCount = results[0].categoryCount;
        }
        else{
            return res.status(500).json(err);
        }
    })

    var query = "select count(id) as productCount from product";
    connection.query(query,(err,results)=>{
        if(!err){
            productCount = results[0].productCount;
        }

        else{
            return res.status(500).json(err);
        }
    })

    var query = "select count(id) as billingCount from billing";
    connection.query(query,(err,results)=>{
        if(!err){
            billingCount = results[0].billingCount;
            var data ={
                category:categoryCount,
                product:productCount,
                billing:billingCount
            };
            return res.status(200).json(data);
        }
        else{
            return res.status(500).json(err);
        }
    })


})

module.exports = router; 