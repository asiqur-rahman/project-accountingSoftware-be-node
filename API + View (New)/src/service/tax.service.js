const db = require('../models/model');
const Logger = require('../externalService/console.log.service');
var path = require('path');
const log = new Logger(path.basename(__filename));
const bcrypt = require('bcryptjs');
const Op = require('sequelize').Op;
const enumm = require('../utils/enum.utils');

const service = {};

service.getTaxDD =async ()=> {
    return await db.Tax.findAll({
        where: {
            [Op.and]: [{
                isActive: {
                    [Op.eq]: true
                }
            }]
        },
        order: [
            ['percentage', 'ASC'],
        ],
        attributes: ['id','name','percentage'],
        raw: true
    }).then(data => {
        var dd=[];
        data.forEach(item=>{
            dd.push({id: item.id, name: `${item.name}(${item.percentage}%)`})
        });
        return dd;
    })
};

service.getById = async (id) => {
    return new Promise(async (resolve, reject) => {
        await db.Tax.findOne({
            where: {
                id: id
            },
            raw: true
        }).then(data => {
            if (data) {
                resolve(data);
            } else {
                resolve({
                    status: 404,
                    message: "Tax not found !"
                })
            }
        }).catch(function (err) {
            reject({
                status: 502,
                message: err.message
            })
        });
    }).catch(function (err) {
        log.debug('Error', {
            error: err.message,
        });
        throw err;
    });
};

service.create = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.Tax.create(req.body).then(data => {
            resolve({
                status: 201,
                message: 'Tax was created, Id:' + data.id
            });
        }).catch(function (err) {
            reject({
                status: 502,
                message: err.message
            });
        });
    });
};

module.exports = service;