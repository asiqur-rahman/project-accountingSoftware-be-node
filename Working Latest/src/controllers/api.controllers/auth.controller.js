const db = require('../../models/model');
const enumm = require('../../utils/enum.utils');
const appConfig = require('../../../config/config.json');
const Op = require('sequelize').Op;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../../service/user.service');

module.exports.login = async (req, res, next) => {
  var clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
  const {
    username,
    password
  } = req.body;
    userService.getByName(username).then(async (user) => {
    if (user.status===404) {
      return res.send({status:0,message:"Unable to login !"});
    } 
    else if (user.data.isActive != 1) {
      return res.send({status:0,message:'You access was revoked by admin! Please contact with admin.'});
    } 
    else {
      const isMatch = await bcrypt.compare(password, user.data.password);
      if (!isMatch) {
        return res.send({status:0,message:'Incorrect password !'});
      } else {
        // user matched!
        const secretKey = appConfig.appSettings.SECRET_JWT;
        
        const fullName=`${user.data['userDetail.firstName']} ${user.data['userDetail.lastName']}`;
        const detailsForToken = {
          user_name: user.data.username,
          full_name: fullName,
          user_id: user.data.id.toString(),
          role_id: user.data['userDetail.role.id'].toString(),
          role_code: user.data['userDetail.role.code'].toString(),
          role_name: user.data['userDetail.role.name'].toString(),
          clientIp: clientIp.toString()
        };
        const token = jwt.sign(detailsForToken,secretKey, {
          expiresIn: appConfig.appSettings.SessionTimeOut
        });
        res.send({
          status:200,
          token,
          details:JSON.stringify(detailsForToken),
          sessionTime: appConfig.appSettings.SessionTimeOut
        });
      }
    }
  })
};


module.exports.whoAmI = async (req, res, next) => {
  await db.User.findOne({
    where: {
      id: req.currentUser
    },
    include: [{
      model: db.UserDetails,
      attributes: ['firstName', 'lastName', 'contactNo', 'email', 'address', 'description'],
      include: {
        model: db.Role,
        as: "role",
        attributes: ['code', 'name']
      }
    }],
    raw: true
  }).then(user => {
    return res.status(200).send(user);
  }).catch(e => {
    return res.status(204).send();
  })
}

// hash password if it exists
hashPassword = async (req) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 8);
  }
}