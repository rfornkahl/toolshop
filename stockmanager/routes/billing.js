const express = require('express');
const connection = require('../connection');
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');
var auth = require('../services/authentication');

router.post('/report', auth.authenticationToken, (req, res) => {
    const generatedUuid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);
  
    var query =
      'insert into billing (name,uuid,email,contactNumber,streetAddress,city,state,zipCode,paymentMethod,total,productDetails,createdBy) values (?,?,?,?,?,?,?,?,?,?,?,?)';
    connection.query(
      query,
      [
        orderDetails.name,
        generatedUuid,
        orderDetails.email,
        orderDetails.contactNumber,
        orderDetails.streetAddress,
        orderDetails.city,
        orderDetails.state,
        orderDetails.zipCode,
        orderDetails.paymentMethod,
        orderDetails.total,
        orderDetails.productDetails,
        res.locals.email,
      ],
      (err, results) => {
        if (!err) {
          ejs.renderFile(
            path.join(__dirname, '', 'report.ejs'),
            {
              productDetails: productDetailsReport,
              name: orderDetails.name,
              email: orderDetails.email,
              contactNumber: orderDetails.contactNumber,
              streetAddress: orderDetails.streetAddress,
              city: orderDetails.city,
              state: orderDetails.state,
              zipCode: orderDetails.zipCode,
              paymentMethod: orderDetails.paymentMethod,
              total: orderDetails.total,
            },
            (err, results) => {
              if (err) {
                return res.status(500).json({
                  message:
                    'An error occurred while attempting to render file. Please try again or contact System Administrator',
                });
              } else {
                pdf.create(results).toFile(
                  './generated_pdf/' + generatedUuid + '.pdf',
                  function (err, data) {
                    if (err) {
                      console.log(err);
                      return res.status(500).json({
                        message:
                          'An error occurred while attempting to generate pdf. Please try again or contact System Administrator',
                      });
                    } else {
                      // Return generated uuid for pdf
                      return res.status(200).json({ uuid: generatedUuid });
                    }
                  }
                );
              }
            }
          );
        } else {
          return res.status(500).json({
            message:
              'An error occurred while attempting to prior to rendering file or generating pdf. Please try again or contact System Administrator',
          });
        }
      }
    );
  });
  
  router.patch('/updateQuantity', auth.authenticationToken, (req, res, next) => {
    let product = req.body;
    var query = 'UPDATE product SET quantity = quantity - ? WHERE id = ?';
    connection.query(query, [product.quantity, product.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: 'Product id does not exist in system.' });
        }
        return res.status(200).json({ message: 'Product quantity has been updated successfully' });
      } else {
        return res.status(500).json(err);
      }
    });
  });

router.post('/pdf', auth.authenticationToken,function(req,res){
    const orderDetails = req.body;
    const pdfPath = './generated_pdf/' + orderDetails.uuid + '.pdf';

    if(fs.existsSync(pdfPath)){
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    }
    else{
        var productDetailsReport = JSON.parse(orderDetails.productDetails);
        ejs.renderFile(path.join(__dirname,'',"report.ejs"),{productDetails:productDetailsReport, name:orderDetails.name,email:orderDetails.email, contactNumber:orderDetails.contactNumber, streetAddress:orderDetails.streetAddress, city:orderDetails.city, state:orderDetails.state, zipCode:orderDetails.zipCode, paymentMethod:orderDetails.paymentMethod, total:orderDetails.total},(err,results)=>{
            if(err){
                return res.status(500).json({message: "An error occurred while attempting to render file. Please try again or contact System Administrator"});
            }
            else {
                pdf.create(results).toFile('./generated_pdf/'+orderDetails.uuid+".pdf",function(err,data){
                    if(err){
                        console.log(err);
                        return res.status(500).json({message: "An error occurred while attempting to generate pdf. Please try again or contact System Administrator"});
                    }
                    else {
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                    }
                })
            }
        })
    }
})

router.get('/getBillingStatments', auth.authenticationToken,(req,res,next)=>{
    var query = "select *from billing order by id DESC";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json({message: "An error occured when attempting to reterive the bills. Please try again or contact System Administrator"});
        }
    })
})


router.delete('/delete/:id', auth.authenticationToken,(req,res,next)=>{
    const id = req.params.id;
    var query = 'delete from billing where id=?';
    connection.query(query,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message: "Bill ID does not exist in database."})
            }
            return res.status(200).json({message:"Bill has been deleted succesfully."})
        }else{
            return res.status(500).json({message: "An error occured when deleting the bill. Please try again or contact System Administrator"})
        }
    })
})

module.exports = router;