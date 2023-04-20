const express = require("express");
const connection = require("../connection");
const router = express.Router();

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
var auth = require("../services/authentication");
var checkRole = require("../services/checkrole");

const bcrypt = require('bcrypt');


router.post("/signup", (req, res) => {
  let {
    name,
    contactNumber,
    email,
    password,
    status,
    securityQuestion,
    securityQuestionAnswer,
    role
  } = req.body;
  password = bcrypt.hashSync(password,10);
  query = "select email,password,role,status from user where email=?";

  connection.query(query, [email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        query =
          "insert into user(name,contactNumber,email,password,securityQuestion,SecurityQuestionAnswer,status,role) values(?,?,?,?,?,?,'true','user')";
        connection.query(
          query,
          [name, contactNumber, email, password, securityQuestion, securityQuestionAnswer],
          (err, results) => {
            if (!err) {
              return res
                .status(200)
                .json({ message: "Succesfully Registered." });
            } else {
              return res.status(500).json(err);
            }
          }
        );
      } else {
        return res
          .status(400)
          .json({
            message:
              "Email Already Exists in System. Please use new email address.",
          });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});


router.post("/login", (req, res) => {
  const user = req.body;
  query = "select email,password,role,status from user where email=?";
  
  connection.query(query, [user.email], async (err, results) => {
    if (!err) {
      if (results.length <= 0) { 
        return res.status(401).json({ message: "Incorrect Username or Password Used" });
      } 
      const passwordMatch = await bcrypt.compare(user.password, results[0].password);
      if (!passwordMatch){
        return res.status(401).json({ message: "Incorrect Username or Password Used" });
      }
       else if (results[0].status === "false") {
        return res.status(401).json({ message: "Your account has been disabled, please contact your Administrator to re-enable your account." });
      } else if (passwordMatch===true) {
        const response = { email: results[0].email, role: results[0].role };
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
          expiresIn: "8h",
        });
        res.status(200).json({ token: accessToken });
      } else {
        return res
          .status(400)
          .json({
            message:
              "We're sorry there appears to be an issue with the current connection. Please try again at a later time.",
          });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

var transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});


//issue with the security question and answer not matching need to see why this is not working
router.post("/forgotpassword", (req, res) => {
  const user = req.body;
  const email = res.locals.email;
  const hashedPassword = bcrypt.hashSync(user.newPassword,10);
  query = "select securityQuestion,securityQuestionAnswer from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(200).json({ message: "Account Does Not Exist." });
      } else if (user.securityQuestion != results[0].securityQuestion || user.securityQuestionAnswer != results[0].securityQuestionAnswer){
        return res.status(200).json({ message: "Security Question and/or Security Question Answer Incorrect."});
      }
      else if (user.securityQuestion == results[0].securityQuestion || user.securityQuestionAnswer == results[0].securityQuestionAnswer) {
        query = "update user set password=? where email=?";
        connection.query(query, [hashedPassword, email], (err, results) => {
          if (!err) {
            return res
              .status(200)
              .json({ message: "Password has been successfully updated." });
          } else {
            return res.status(500).json(err);
          }
        });
      } else {
        return res
          .status(400)
          .json({ message: "Something went wrong. Please try again later."});
      }
    } else {
      return res.status(500).json(err);
    }
  });
});




router.get(
  "/allusers",
  auth.authenticationToken,
  checkRole.checkRole,
  (req, res) => {
    var query =
      "select *from user order by id";
    connection.query(query, (err, results) => {
      if (!err) {
        return res.status(200).json(results);
      } else {
        return res.status(500).json(err);
      }
    });
  }
);




router.patch('/update', auth.authenticationToken,checkRole.checkRole ,(req,res,next)=>{
  let user = req.body;
  var query = "update user set name=?, contactNumber=?,email=?,securityQuestion=?,securityQuestionAnswer=?,role=? where id=?";
  connection.query(query,[user.name, user.contactNumber, user.email, user.securityQuestion,user.securityQuestionAnswer, user.role,user.id],(err,results)=>{
      if(!err){
          if(results.affectedRows==0){
              return res.status(404).json({message: "User does not exist in system."});
          }
          return res.status(200).json({message: "User has been updated successfully"});
      }
      else{
          return res.status(500).json(err);
      }
  });
});



router.get("/token", auth.authenticationToken, (req, res) => {
  return res.status(200).json({ message: "true" });
});




router.post("/resetpassword", auth.authenticationToken, (req, res) => {
  const user = req.body;
  const email = res.locals.email;
  console.log("This is the user email address: "+ email);
  console.log("This is the user's current password: " + user.oldPassword);
  const hashedPassword = bcrypt.hashSync(user.newPassword,10);
  var query = "select * from user where email=?";
  connection.query(query, [email, user.oldPassword],  (err, results) => {
    if (!err) {
      if (!bcrypt.compareSync(user.oldPassword, results[0].password)) {
        return res.status(400).json({ message: "Incorrect Password" });
      } else if (bcrypt.compareSync(user.oldPassword, results[0].password)) {
        query = "update user set password=? where email=?";
        connection.query(query, [hashedPassword, email], (err, results) => {
          if (!err) {
            return res
              .status(200)
              .json({ message: "Password has been successfully updated." });
          } else {
            return res.status(500).json(err);
          }
        });
      } else {
        return res
          .status(400)
          .json({ message: "Something went wrong. Please try again later." });
      }
    } else {
      return res.status(500).json(err);
    }
  });
  console.log("This is the user's new password: " + user.newPassword);
  console.log("This is the user's new hashed password: " + hashedPassword);
  console.log("-------------------------");
});





router.delete('/delete/:id', auth.authenticationToken,checkRole.checkRole ,(req,res,next)=>{
  const id = req.params.id;
  var query = "delete from user where id=?";
  connection.query(query,[id],(err,results)=>{
      if(!err){
          if(results.affectedRows == 0){
              return res.status(404).json({message: "User does not exist in system"});
          }
          return res.status(200).json({message: "User has been deleted successfully"});
      }
      else{
          return res.status(500).json(err);
      }
  });
});


module.exports = router;
