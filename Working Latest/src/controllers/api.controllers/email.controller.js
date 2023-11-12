const db = require('../models/model');
const Op = require('sequelize').Op;
const fs = require('fs');
var nodemailer = require('nodemailer');
const appConfig = require('../../config/config.json');

var transport = nodemailer.createTransport({
    host: appConfig.emailSettings.host,//"mail.chickenman.net.au",
    port: appConfig.emailSettings.port,//465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: appConfig.emailSettings.email,
      pass: appConfig.emailSettings.password,
    },
    tls: {
      rejectUnauthorized: false
  }
});

module.exports.sendMail = async (req, res, next) => {
    req.body.Date=new Date();
    req.body.MailTotal=req.body.To.length;
    req.body.MailTo=JSON.stringify(req.body.To);
    req.body.UserId=req.currentUser;
    await db.sendMail.create(req.body)
    .then(async mail => {

            var mailOptions = {
                from: [{ name: config.emailSetting.name, address:config.emailSetting.email }], // sender address
                // from: [{ name: "Talukder Mortgage", address:"mail@braintechsolution.com" }], // sender address
                bcc: req.body.To,
                subject: req.body.MailSubject,//'Nice Nodemailer test',
                text: req.body.MailBody,//'Hey there, it’s our first message sent with Nodemailer ;) ',
                html: req.body.MailBody//'<b>Hey there! </b><br> This is our first message sent with Nodemailer'
            };

            // try{
            // verify connection configuration
            transport.verify(function(error, success) {
                if (error) {
                    console.log("Error: "+error);
                    res.status(200).json({
                        statusCode:502,
                        message:error
                    });
                } else {
                    console.log("Server is ready to take our messages");
                }
            });
        
            transport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error: "+error);
                    deleteEmail(mail.Id);
                    res.status(200).json({
                        statusCode:502,
                        message:error
                    });
                }
                else if(info){
                    // console.log('Email sent: ' + info.response)
                    res.status(200).json({
                        statusCode:200,
                        message:'Email sent: ' + info.response
                    });
                }
            });
    }).catch(function (err) {
        res.status(200).json({
            statusCode:502,
            message:err.message
        });
    });
};


module.exports.sendMail_Func = async (mail,req) => {
    mail.Date=new Date();
    mail.MailTotal=mail.To.length;
    mail.MailTo=JSON.stringify(mail.To);
    mail.userId=req.currentUser;
    return await db.sendMail.create(mail)
    .then(async result => {
            var mailOptions = {
                from: [{ name: config.emailSetting.name, address:config.emailSetting.email }], // sender address
                bcc: mail.To,
                subject: result.MailSubject,
                text: result.MailBody,
                html: result.MailBody//'<b>Hey there! </b><br> This is our first message sent with Nodemailer'
            };

            // verify connection configuration
            transport.verify(function(error, success) {
                if (error) {
                    console.log("Error: "+error);
                    return false;
                } else {
                    console.log("Server is ready to take our messages");
                }
            });
        
            transport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error: "+error);
                    deleteEmail(result.Id);
                    return false;
                }
                else if(info){
                    console.log('Email sent: ' + info.response)
                    return true;
                }
            });
    }).catch(function (err) {
        console.log("Error :",err)
        return false;
    });
};

deleteEmail=async (id)=>{
    await db.sendMail.destroy({ 
        where:{Id:id}
    })
}