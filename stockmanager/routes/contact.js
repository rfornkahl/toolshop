const express = require("express");
const connection = require("../connection");
const router = express.Router();

const nodemailer = require("nodemailer");
require("dotenv").config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

// Endpoint to handle the external contact form submission
router.post('/contact-us', (req, res) => {
  const { firstName, lastName, phone, email, summary, details } = req.body;
  
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `Request from ${firstName} + ${lastName} from the Tool Store`,
    html: `<h1>You have received a user request from the Tool Store</h1><br>
    <p>Name: ${firstName} + ${lastName}</p>
           <p>Phone: ${phone}</p>
           <p>Email: ${email}</p>
           <p>Summary: ${summary}</p>
           <p>Details: ${details}</p>
           <br><center><p>The Tool Store</p></center>
           <p><center>St. Louis, MO</center></p>
           <p><center>Est. 2023</center></p>`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'An error occurred while sending the email' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});

// Endpoint to handle the admin contact form submission
// router.post('/admin-contact', (req, res) => {
//   const { firstName, lastName, phone, email, summary, details, approval } = req.body;
  
//   const mailOptions = {
//     from: process.env.EMAIL,
//     to: email,
//     subject: `Admin Request from ${firstName} + ${lastName} for the Tool Store`,
//     html: `<h1>You have received a Admin Rrequest from the Tool Store</h1>
//            <p>Name: ${firstName} + ${lastName}</p>
//            <p>Phone: ${phone}</p>
//            <p>Email: ${email}</p>
//            <p>Summary: ${summary}</p>
//            <p>Details: ${details}</p>
//            <p>Approval (required if requesting a Admin role): ${approval}</p>
//            <br><center><p>The Tool Store</p></center>
//            <p><center>St. Louis, MO</center></p>
//            <p><center>Est. 2023</center></p>`
//   };

//   // Send the email
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//       res.status(500).json({ message: 'An error occurred while sending the email' });
//     } else {
//       console.log('Email sent: ' + info.response);
//       res.status(200).json({ message: 'Email sent successfully' });
//     }
//   });
// });


module.exports = router;