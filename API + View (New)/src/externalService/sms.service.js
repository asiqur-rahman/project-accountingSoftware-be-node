const db = require('../models/model');
const sequelize = require('sequelize');
const axios = require("axios");
const config = require('../../config/config.json');
const Log = require('./log.service');

module.exports.sendSms = async (mobileNo,smsBody) => {
    if(config.smsSettings.connection && mobileNo.length > 10){
      const body ={
        SenderId: config.smsSettings.senderId,
        Is_Unicode: true,
        Is_Flash: true,
        SchedTime: null,
        GroupId: null,
        Message: smsBody,
        MobileNumbers: "88"+mobileNo,
        ApiKey: config.smsSettings.apiKey,
        ClientId: config.smsSettings.clientId
      };
      console.log(body)
      await axios.post('https://api.smsq.global/api/v2/SendSMS',body).then(function (response) {
        Log.CreateLog('Sms Send Request (To - '+mobileNo+'). Request: '+ JSON.stringify(body),'sms');
        Log.CreateLog('Sms Send Response (To - '+mobileNo+'). Response: '+ JSON.stringify(response.data.Data),'sms');
        if(response.data.Data[0].MessageErrorCode=='1086'){
          Log.CreateLog('Sms Send Failed (To - '+mobileNo+'). Reason: '+ response.data.Data[0].MessageErrorDescription);
        }else{
          Log.CreateLog('Sms Send Success (To - '+mobileNo+'). MessageId: '+ response.data.Data[0].MessageId);
        }
        return {Response:response.data};
      })
      .catch(function (error) {
        Log.CreateLog('Sms Send Failed (To - '+mobileNo+'). Result:'+ error);
        return {error};
      });
    }else{
      return null;
    }
  }