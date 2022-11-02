const db = require('../../models/model');
const enumm = require('../../utils/enum.utils');
const appConfig = require('../../../config/config.json');
const Op = require('sequelize').Op;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.login = async (req, res, next) => {
  var clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
  const {
    username,
    password
  } = req.body;
  const user = await db.User.scope('loginPurpose').findOne({
    where: {
      username: username
    },
    // where:{[Op.and]: [{Username:username}, {Status:1}]},
    include: [{
      model: db.UserDetails,
      attributes: ['firstName', 'lastName'],
      include: {
        model: db.Role,
        as: "role",
        attributes: ['code']
      }
    }],
    raw: true
  });
  if (!user) {
    res.status(200).send({
      status: 401,
      message: "Username not found !"
    });
  } else if (user.isActive != 1) {
    res.status(200).send({
      status: 401,
      message: "User Permission revoked by admin ! Please Contact with admin immediately."
    });
  } else {
    const roleId = user['userDetail.role.code'];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(200).send({
        status: 401,
        message: "Incorrect password !"
      });
    } else {
      for (var key in user) {
        if (key.includes(".")) {
          var newKey = key.replace('.', '');
          user[newKey] = user[key];
          delete user[key];
        }
      }
      // user matched!
      const secretKey = appConfig.appSettings.SECRET_JWT;

      const token = jwt.sign({
        user_id: user.id.toString(),
        role_id: roleId.toString(),
        clientIp: clientIp.toString()
      }, secretKey, {
        expiresIn: appConfig.appSettings.SessionTimeOut
      });
      const {
        password,
        ...userWithoutPassword
      } = user;
      res.send({
        status:200,
        token,
        role: user.RoleName,
        sessionTime: appConfig.appSettings.SessionTimeOut
      });
    }
  }
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