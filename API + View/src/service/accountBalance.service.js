const db = require('../models/model');
const Logger = require('../externalService/console.log.service');
var path = require('path');
const log = new Logger(path.basename(__filename));
const bcrypt = require('bcryptjs');
const Op = require('sequelize').Op;
const enumm = require('../utils/enum.utils');

const service = {};

service.create = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.AccountBalance.create(req.body).then((result) => {
            resolve({
                status: 201,
                message: 'Account Balance was created, Id:' + result.id
            });
        })
    })
};

module.exports = service;