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
    if (!user) {
      req.session.notification = [enumm.notification.Error, 'Unable to login !'];
      return res.redirect('/auth/login');
    } else if (user.isActive != 1) {
      req.session.notification = [enumm.notification.Error, 'You access was revoked by admin! Please contact with admin.'];
      return res.redirect('/');
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        req.session.notification = [enumm.notification.Error, 'Incorrect password !'];
        return res.redirect('/');
      } else {
        // user matched!
        const secretKey = appConfig.appSettings.SECRET_JWT;
        
        const fullName=`${user['userDetail.firstName']} ${user['userDetail.lastName']}`;
        const detailsForToken = {
          user_name: user.username,
          full_name: fullName,
          user_id: user.id.toString(),
          role_id: user['userDetail.role.id'].toString(),
          role_code: user['userDetail.role.code'].toString(),
          role_name: user['userDetail.role.name'].toString(),
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