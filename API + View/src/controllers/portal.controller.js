const db = require('../models/model');
const Op = require('sequelize').Op;
const sequelize = require('sequelize');
var multer = require('multer');
const fs = require('fs');
const path = require('path');
const enumm = require('../utils/enum.utils');
const del = require('del');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const formidable = require('formidable');
const emailController = require('./email.controller');
const {CustomDateTime} = require('../utils/common.utils');

GetRoleIdByCode = async (code) => {
    return await db.role.findOne({
        where: {
            code: code
        },
        raw: true
    }).then((role) => {
        return role ? role.id : 0;
    });
    // return Role.Code==enumm.Role.Admin?{userId:Role.Id}:true;
};
async function getRoleDropDown() {
    return await db.role.findAll({
        where: {
            [Op.and]: [{
                code: {
                    [Op.ne]: enumm.role.SuperUser
                }
            }, {
                code: {
                    [Op.ne]: enumm.role.Supplier
                }
            }]
        },

        attributes: ['name', 'id'],
        raw: true
    }).then(data => {
        return data;
    })
};
async function getAttendanceTypeDropDown() {
    return await db.attendanceType.findAll({
        attributes: ['name', 'id'],
        order: [
            // Will escape title and validate ASC against a list of valid direction parameters
            ['code', 'ASC']
        ],
        raw: true
    }).then(data => {
        return data;
    })
};
async function getPaymentTypeDropDown() {
    return await db.paymentType.findAll({
        attributes: ['name', 'id'],
        raw: true
    }).then(data => {
        return data;
    })
};

async function getTallyCustomerDropDown() {
    return await db.tallyCustomer.findAll({
        raw: true
    }).then((data) => {
        var result = [];
        data.forEach(element => {
            result.push({
                id: element.id,
                name: `${element.fullName}-${element.contactNo}-${element.email}`
            })
        });
        return result;
    });
};

async function getDetailsInfoDropDown(roleEnum=-1) {
    if(roleEnum!=-1){
        return GetRoleIdByCode(roleEnum).then(async roleId => {
            return await db.detailsInfo.findAll({
                where: {
                    roleId: roleId
                },
                attributes: ['name', 'id', 'email', 'contactNo'],
                raw: true
            }).then((data) => {
                var result = [];
                data.forEach(element => {
                    result.push({
                        id: element.id,
                        name: `${element.name}-${element.contactNo}-${element.email}`
                    })
                });
                return result;
            })
        })
    }
    else{
        return GetRoleIdByCode(enumm.role.SuperUser).then(async roleId => {
            return await db.detailsInfo.findAll({
                where: {
                    roleId: {
                        [Op.ne]: roleId
                    }
                },
                attributes: ['name', 'id', 'email', 'contactNo'],
                raw: true
            }).then((data) => {
                var result = [];
                data.forEach(element => {
                    result.push({
                        id: element.id,
                        name: `${element.name}-${element.contactNo}-${element.email}`
                    })
                });
                return result;
            })
        });
    }
    
};
async function getSupplierDropDown() {
    return GetRoleIdByCode(enumm.role.Supplier).then(async roleId => {
        return await db.detailsInfo.findAll({
            where: {
                roleId: roleId
            },
            attributes: ['name', 'id', 'email', 'contactNo'],
            raw: true
        }).then((data) => {
            var result = [];
            data.forEach(element => {
                result.push({
                    id: element.id,
                    name: `${element.name}-${element.contactNo}-${element.email}`
                })
            });
            return result;
        })
    })
};

module.exports.portalProfile_Get = async (req, res, next) => {
    await db.user.findOne({
        where: {
            id: req.currentUser
        },
        include: [{
            model: db.detailsInfo
        },
        {
            model: db.role
        }],
        raw: true
    }).then(async user => {
        res.locals = {
            title: `Force Password Change`,
            userDetails:user
        };
        res.render('Profile/index');
    });
};

module.exports.portalProfile_Post = async (req, res, next) => {
    await db.detailsInfo.update(req.body, {
        where: {
            id: req.body.detailsInfoId
        }
    }).then(async () => {
        await db.user.update(req.body, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            req.session.notification=[enumm.notification.Success,'Profile updated successfully !'];
            res.redirect(`/portal-user-profile`);
        });
    }).catch(function (err) {
        req.session.notification=[enumm.notification.Error,'Profile not updated !'];
        res.redirect(`/portal-user-profile`);
    });
};

module.exports.forceChangePassword_Get = async (req, res, next) => {
    if (req.forceChangePassword == 1) {
        res.locals = {
            title: `Force Password Change`
        };
        res.render('Auth/auth-force-change-password', {
            layout: false
        });
    } else {
        next();
    }
};

module.exports.forceChangePassword_Post = async (req, res, next) => {
    await bcrypt.hash(req.body.newPassword, 8).then(async password => {
        await db.user.update({
            forceChangePassword: 0,
            password: password
        }, {
            where: {
                id: req.currentUser
            }
        }).then(() => {
            req.flash(enumm.notification.Info, 'Password Changed Successfully! </br>Please login with your new password');
            res.redirect('/logout');
        }).catch(function (err) {
            req.flash(enumm.notification.Info, 'Please Change Your Password.');
            res.locals = {
                title: `Force Password Change`,
            };
            res.render('Auth/auth-force-change-password', {
                layout: false
            });
        });
    });
};

module.exports.dashboardForApex = async (req, res, next) => {
    db.sequelize.query('CALL Dashboard (:days)', {
            replacements: {
                days: req.params.forData? req.params.forData : 7,
            }
        })
        .then(async function (results) {
            var dates=results[0].dates.split(',');
            var sales=results[0].sales.split(',');
            var finalDates=[];
            var finalSales=[];
            dates.forEach((element, index) => {
                if(element==dates[index-1]){
                    finalSales[index-1]=(parseFloat(sales[index-1])+parseFloat(sales[index])).toString()
                }else{
                    finalDates.push(element);
                    finalSales.push(sales[index]);
                }
            });
            results[0].dates=finalDates.join(",");
            results[0].sales=finalSales.join(",");
            res.status(200).send(results[0]);
        })
        .catch(function (err) {
            res.status(200).send();
        }
    );
};

module.exports.dashboard = async (req, res, next) => {
    db.sequelize.query('CALL Dashboard (:days)', {
            replacements: {
                days: 7,
            }
        })
        .then(async function (results) {
            var dates=results[0].dates.split(',');
            var sales=results[0].sales.split(',');
            var finalDates=[];
            var finalSales=[];
            dates.forEach((element, index) => {
                if(element==dates[index-1]){
                    finalSales[index-1]=(parseFloat(sales[index-1])+parseFloat(sales[index])).toString()
                }else{
                    finalDates.push(element);
                    finalSales.push(sales[index]);
                }
            });
            results[0].dates=finalDates.join(",");
            results[0].sales=finalSales.join(",");
            res.locals = {
                title: 'Dashboard',
                results: results[0]
            };
            res.render('Dashboard/index');
        })
        .catch(function (err) {
            res.locals = {
                title: 'Dashboard'
            };
            res.render('Dashboard/index');
        });
};

module.exports.calender = async (req, res, next) => {
    res.locals = {
        title: 'Calendar'
    };
    res.render('Calendar/calendar');
};

module.exports.tvAdsIndex = async (req, res, next) => {
    await getAllAds().then((result) => {
        res.locals = {
            title: 'TV ADS',
            allAds: result
        };
        res.render("Ads/index");
    });
};

module.exports.tvAdsCreate_Get = async (req, res, next) => {
    res.locals = {
        title: 'TV ADS Create',
        actionUrl: '/portal-tv-ads-create/'
    };
    res.render("Ads/create");
};

module.exports.tvAdsCreate_Post = async (req, res, next) => {

    const adsName = req.params.adsName;
    const imagesPath = req.params.adsName.replace(/\s+/g, '_').toLowerCase();

    if (adsName) {
        var ads = {
            name: adsName,
            imagesPath: imagesPath
        };
        var mainPath = path.join(__dirname, '..', '..', 'public', 'tvAds');

        if (!fs.existsSync(mainPath)) {
            await fs.mkdirSync(mainPath);
        }

        var uploadPath = path.join(mainPath, imagesPath);
        if (!fs.existsSync(uploadPath)) {
            await fs.mkdirSync(uploadPath);
        }

        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, uploadPath)
            },
            filename: function (req, file, cb) {
                // cb(null, Date.now() + '-' +file.originalname )
                cb(null, file.originalname)
            }
        });

        var upload = multer({
            storage: storage
        }).array('file');

        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            } else {
                // res.redirect("/portal-set-tv-ads");
                return res.status(500).json(err)
            }
        });
    }

    res.redirect("/portal-set-tv-ads");
};

module.exports.tvAdsDelete_Get = async (req, res, next) => {
    if (req.params.adsName) {
        var dir = path.join(__dirname, '..', '..', 'public', 'tvAds', req.params.adsName);
        // delete directory recursively
        (async () => {
            try {
                await del(dir);
                req.flash('success', 'Ads Deleted Successfully.');
                res.redirect("/portal-set-tv-ads");
            } catch (err) {
                req.flash('error', 'Unable to Delete Ads !');
                res.redirect("/portal-set-tv-ads");
            }
        })();
    }
};

async function getAllAds() {
    const foldersPath = path.join(__dirname, '..', '..', 'public', 'tvAds');
    var folders = fs.readdirSync(foldersPath);
    var results = [];
    folders.forEach(element => {
        const filePath = path.join(__dirname, '..', '..', 'public', 'tvAds', element);
        const downloadPath = path.join('/public', 'tvAds', element)
        var files = fs.readdirSync(filePath);
        if (files.length > 0) {
            var count = 1;
            var data = [];
            files.forEach(element => {
                data.push({
                    id: count++,
                    name: element,
                    link: path.join('/public', '/assets', '/images', '/default_ads.png')
                }) //link:path.join(downloadPath,element)})
            });
            data.adsName = element;
            data.adsLink = path.join('/tvAdsShow', element);
            results.push(data);
        }
    });
    return results;
}


//--------------User Start-------------
module.exports.portalUserList = async (req, res, next) => {
    const area = 'User';
    res.locals = {
        title: `${area} List`
    };
    res.render(`${area}/index`);
};

module.exports.portalUsernameCheck = async (req, res, next) => {
    if (req.params.username) {
        await db.user.findOne({
            where: {
                username: req.params.username
            },
            raw: true
        }).then(async user => {
            if(user){
                res.status(200).send({'status':1});
            }else{
                res.status(200).send({'status':0});
            }
        });
    }
    else{
        res.status(200).send({'status':0});
    }
};

module.exports.getPortalUserListData = async (req, res, next) => {

    GetRoleIdByCode(enumm.role.SuperUser).then(async (roleId) => {
        
        //-----------------Server side pagination----------------------
        const order = req.query.columns[req.query.order[0].column].data=='sl'?[]:sequelize.literal(req.query.columns[req.query.order[0].column].data+" "+req.query.order[0].dir);//req.query.order[0].column=='0'?[]:[[req.query.columns[req.query.order[0].column].data,req.query.order[0].dir]];
        var searchQuery=[];
        req.query.columns.forEach(coloum => {
            if(coloum.data!='sl' && coloum.data!='id')searchQuery.push(sequelize.col(coloum.data));
        });
        var where = {};
        if(req.query.search.value!=''){
            where = {
                [Op.and]: [
                    sequelize.where(sequelize.fn("concat",...searchQuery), "like", '%'+req.query.search.value+'%' )
                    , {
                    roleId: {
                        [Op.ne]: roleId
                    }
                }]
            }
        }else{
            where = {
                [Op.and]: [ {
                    roleId: {
                        [Op.ne]: roleId
                    }
                }]
            }
        }
        //-----------------Server side pagination----------------------

        await db.user.findAndCountAll({
            offset: parseInt(req.query.start),
            limit : parseInt(req.query.length),
            // subQuery:false,
            where: where,
            include: [{
                    model: db.detailsInfo,
                    attributes: ['name','email']
                },
                {
                    model: db.role,
                    attributes: ['name','code']
                }
            ],
            order: order,
            raw: true
        }).then(detailsInfo => {
            if (detailsInfo.rows) {
                var count = req.query.start;
                detailsInfo.rows.forEach(detail => {
                    detail.sl = ++count;
                })
                // console.log(detailsInfo);
                res.status(200).send({draw:req.query.draw,recordsTotal:detailsInfo.count,recordsFiltered:detailsInfo.count,data:detailsInfo.rows});
            } else {
                res.status(200).send();
            }
        });
    });
};

module.exports.portalUserCreate_Get = async (req, res, next) => {
    const area = 'User';
    if (req.params.id && req.params.id > 0) {
        await db.user.findOne({
            where: {
                id: req.params.id
            },
            include: {
                model: db.detailsInfo
            },
            raw: true
        }).then(async user => {
            await db.detailsInfo.findOne({
                where: {
                    id: user.detailsInfoId
                },
                raw: true
            }).then(detailsInfo => {
                getRoleDropDown().then(roleDD => {
                    detailsInfo.username = user.username;
                    detailsInfo.roleId = user.roleId;
                    detailsInfo.userId = user.id;
                    res.locals = {
                        title: `${area} Create`,
                        employeeCode: Date.now() % 100000000,
                        roleDD: roleDD,
                        detailsInfo: detailsInfo
                    };
                    res.render(`${area}/create`);
                })
            });
        });
    } else {
        getRoleDropDown().then(roleDD => {
            res.locals = {
                title: `${area} Create`,
                employeeCode: Date.now() % 100000000,
                roleDD: roleDD
            };
            res.render(`${area}/create`);
        })
    }
};


module.exports.portalUserCreate_Post = async (req, res, next) => {
    const area = 'User';
    if (req.body.id && req.body.id > 0) {
        await db.detailsInfo.update(req.body, {
            where: {
                id: req.body.id
            }
        }).then(async () => {
            await db.user.update(req.body, {
                where: {
                    id: req.body.userId
                }
            }).then(() => {
                req.session.notification=[enumm.notification.Success,'User updated successfully !'];
                res.redirect(`/portal-${area.toLowerCase()}-list`);
            });
        }).catch(function (err) {
            res.locals = {
                title: `${area} Create`,
                employeeCode: Date.now() % 100000000,
                detailsInfo: req.body
            };
            req.session.notification=[enumm.notification.Error,'User not updated !'];
            res.render(`/${area}/create`);
        });
    } else {
        await db.detailsInfo.create(req.body)
            .then(async (result) => {
                if (result) {
                    await db.detailsInfo.findOne({
                        where: {
                            employeeCode: req.body.employeeCode
                        },
                        raw: true
                    }).then(async detailsInfo => {
                        const passwordNotHashed = (Date.now() % 10000000000).toString();
                        await bcrypt.hash(passwordNotHashed, 8).then(async password => {
                            req.body.password = password;
                            req.body.detailsInfoId = detailsInfo.id;
                            await db.user.create(req.body)
                                .then(async () => {
                                    await emailController.sendMail_Func({
                                        To: [detailsInfo.email],
                                        MailSubject: "Chicken Man User Portal Credentials.",
                                        MailBody: `Hi ${detailsInfo.name}, <br/><br/>Welcome to Chicken Man. Here is your portal login credentials.<br/><br/>UserName : <b>${req.body.username}</b><br/>Password : <b>${passwordNotHashed}</b><br/><br/>Please reset your password from the below link<br/>https://chickenman.net.au/login<br/><br/> Thank you for joining Chicken Man.<br/><br/>Best Regards,<br/>Chicken Man<br/>(02) 4856 8660<br/>info@chickenman.net.au<br/>www.chickenman.net.au<br/>12 Verner St, Goulburn, NSW, Australia `
                                    }, req).then((result) => {
                                        // console.log(result);
                                        // res.redirect(`/portal-${area}-list`);
                                        req.session.notification=[enumm.notification.Success,'User created successfully!'];
                                        res.redirect(`/portal-${area.toLowerCase()}-create`);
                                    });
                                });
                        });
                    });
                } else {
                    req.session.notification=[enumm.notification.Error,'User not created !'];
                    // req.flash('responseMessage',JSON.stringify({type:'success',message:'User Created Successfully !'}))
                    res.redirect(`/portal-${area.toLowerCase()}-create`);
                }
            });
    }
};


module.exports.portalUserPasswordReset_Get = async (req, res, next) => {
    const area = 'User';
    await db.user.findOne({
        where: {
            id: req.params.userId
        },
        include: {
            model: db.detailsInfo,
            attributes: ['email']
        },
        raw: true
    }).then(async userInfo => {
        if (userInfo) {
            const passwordNotHashed = (Date.now() % 10000000000).toString();
            await bcrypt.hash(passwordNotHashed, 8).then(async password => {
                await db.user.update({
                        password: password,
                        forceChangePassword: 1
                    }, {
                        where: {
                            id: userInfo.id
                        }
                    })
                    .then(async () => {
                        await emailController.sendMail_Func({
                            To: [userInfo['detailsInfo.email']],
                            MailSubject: "Chicken Man Reset User Portal Credentials.",
                            MailBody: `Hi ${userInfo.username.toUpperCase()}, <br/><br/>Welcome to Chicken Man. Here is your new portal login credentials.<br/><br/>UserName:<b>${userInfo.username}</b><br/>Password : <b>${passwordNotHashed}</b><br/><br/>Please reset your password from the below link<br/>https://chickenman.net.au/login<br/><br/> Thank you for joining Chicken Man.<br/><br/>Best Regards,<br/>Chicken Man<br/>(02) 4856 8660<br/>info@chickenman.net.au<br/>www.chickenman.net.au<br/>12 Verner St, Goulburn, NSW, Australia `
                        }, req).then((result) => {
                            // res.status(200).send({status:true,result:result});
                            if(req.params.isProfile && req.params.isProfile==1){
                                req.session.notification=[enumm.notification.Success,'Password reseted successfully!'];
                                res.redirect(`/portal-user-profile`);
                            }else{
                                res.redirect(`/portal-${area}-list`);
                            }
                        });
                    });
            });
        } else {
            if(req.params.isProfile && req.params.isProfile==1){
                req.session.notification=[enumm.notification.Success,'Password reseted successfully!'];
                res.redirect(`/portal-user-profile`);
            }else{
                res.redirect(`/portal-${area}-list`);
            }
        }

    });
};


module.exports.portalUserChangeStatus_Get = async (req, res, next) => {
    const area = 'User';
    await db.user.findOne({
        where: {
            id: req.params.userId
        },
        raw: true
    }).then(async userInfo => {
        if (userInfo) {
            await db.user.update({
                    isActive: userInfo.isActive==1?0:1,
                }, {
                    where: {
                        id: userInfo.id
                    }
                })
                .then(async () => {
                    req.session.notification=[enumm.notification.Success,'User status changes successfully!'];
                    res.redirect(`/portal-${area.toLowerCase()}-list`);
                });
        } else {
            req.session.notification=[enumm.notification.Error,'User not found!'];
            res.redirect(`/portal-${area.toLowerCase()}-list`);
        }

    });
};


module.exports.portalUserDelete_Get = async (req, res, next) => {
    const area = 'User';
    if (req.params.id && req.params.id > 0) {
        await db.user.destroy({
            where: {
                id: req.params.id
            },
        }).then(() => {
            req.session.notification=[enumm.notification.Success,'User deleted successfully!'];
            res.redirect("/portal-employee-list");
        });
    }
};
//--------------User End-------------


//--------------Employee Start-------------
module.exports.portalEmployeeList = async (req, res, next) => {
    const area = 'Employee';
    res.locals = {
        title: 'Employees List'
    };
    res.render(`${area}/index`);
};

module.exports.getPortalEmployeeListData = async (req, res, next) => {
    GetRoleIdByCode(enumm.role.Employee).then(async (employeeRoleId) => {
        GetRoleIdByCode(enumm.role.Manager).then(async (managerRoleId) => {
            await db.detailsInfo.findAll({
                where: {
                    [Op.or]: [{
                        roleId: {
                            [Op.eq]: req.params.roleId ? req.params.roleId : employeeRoleId
                        }
                    }, {
                        roleId: {
                            [Op.eq]: req.params.roleId ? req.params.roleId : managerRoleId
                        }
                    }]
                },
                include: {
                    model: db.role,
                    attributes: ['name']
                },
                order: [
                    ['id', 'ASC']
                ],
                raw: true
            }).then(detailsInfo => {
                if (detailsInfo) {
                    var count = 1;
                    detailsInfo.forEach(detail => {
                        detail.sl = count++;
                    });
                    res.status(200).send(detailsInfo);
                } else {
                    res.status(200).send();
                }
            });
        });
    });
};

module.exports.portalEmployeeCreate_Get = async (req, res, next) => {
    const area = 'Employee';
    if (req.params.id && req.params.id > 0) {
        await db.detailsInfo.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        }).then(detailsInfo => {
            res.locals = {
                title: `${area} Create`,
                employeeCode: Date.now() % 100000000,
                detailsInfo: detailsInfo
            };
            res.render(`${area}/create`);
        });
    } else {
        GetRoleIdByCode(enumm.role.Employee).then(id => {
            res.locals = {
                title: `${area} Create`,
                roleId: id,
                employeeCode: Date.now() % 100000000
            };
            res.render(`${area}/create`);
        })
    }
};


module.exports.portalEmployeeCreate_Post = async (req, res, next) => {
    const area = 'Employee';
    if (req.body.id && req.body.id > 0) {
        await db.detailsInfo.update(req.body, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            req.session.notification=[enumm.notification.Success,'Employee updated successfully !'];
            res.redirect(`/portal-${area}-list`);
        }).catch(function (err) {
            res.locals = {
                title: `${area} Create`,
                employeeCode: Date.now() % 100000000,
                detailsInfo: req.body
            };
            req.session.notification=[enumm.notification.Error,'Employee not updated !'];
            res.render(`/${area}/create`);
        });
    } else {
        await db.detailsInfo.create(req.body)
            .then((result) => {
                if (result) {
                    res.locals = {
                        title: `${area} Create`,
                        employeeCode: Date.now() % 100000000
                    };
                    req.session.notification=[enumm.notification.Success,'Employee created successfully !'];
                    res.redirect(`/portal-${area.toLowerCase()}-create`);
                } else {
                    res.locals = {
                        title: `${area} Create`,
                        employeeCode: Date.now() % 100000000
                    };
                    req.session.notification=[enumm.notification.Error,'Employee not created !'];
                    res.redirect(`/portal-${area.toLowerCase()}-create`);
                }
            });
    }
};


module.exports.portalEmployeeDelete_Get = async (req, res, next) => {
    const area = 'Employee';
    if (req.params.id && req.params.id > 0) {
        await db.detailsInfo.destroy({
            where: {
                id: req.params.id
            },
        }).then(() => {
            req.session.notification=[enumm.notification.Success,'Employee deleted successfully !'];
            res.redirect("/portal-employee-list");
        });
    }
};
//--------------Employee End-------------


//--------------Supplier Start-------------
module.exports.portalSupplierList = async (req, res, next) => {
    const area = 'Supplier';
    res.locals = {
        title: `${area} List`
    };
    res.render(`${area}/index`);
};

module.exports.getPortalSupplierListData = async (req, res, next) => {
    GetRoleIdByCode(enumm.role.Supplier).then(async (roleId) => {
        await db.detailsInfo.findAll({
            where: {
                roleId: req.params.roleId ? req.params.roleId : roleId
            },
            order: [
                ['id', 'ASC']
            ],
            raw: true
        }).then(detailsInfo => {
            if (detailsInfo) {
                var count = 1;
                detailsInfo.forEach(detail => {
                    detail.sl = count++;
                })
                res.status(200).send(detailsInfo);
            } else {
                res.status(200).send();
            }
        });
    })
};

module.exports.portalSupplierCreate_Get = async (req, res, next) => {
    const area = 'Supplier';
    if (req.params.id && req.params.id > 0) {
        await db.detailsInfo.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        }).then(data => {
            // data.date=moment.utc(data.date).format("DD-MM-yyyy");
            res.locals = {
                title: `${area} Create`,
                employeeCode: Date.now() % 100000000,
                detailsInfo: data
            };
            res.render(`${area}/create`);
        });
    } else {
        GetRoleIdByCode(enumm.role.Supplier).then(id => {
            res.locals = {
                title: `${area} Create`,
                roleId: id,
                employeeCode: Date.now() % 100000000
            };
            res.render(`${area}/create`);
        })
    }
};

module.exports.portalSupplierCreate_Post = async (req, res, next) => {
    const area = 'Supplier';
    req.body.date = moment.utc(req.body.date).format("yyyy-MM-DD");
    if (req.body.id && req.body.id > 0) {
        await db.detailsInfo.update(req.body, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            req.session.notification=[enumm.notification.Success,'Supplier updated successfully !'];
            res.redirect(`/portal-${area.toLowerCase()}-list`);
        }).catch(function (err) {
            res.locals = {
                title: `${area} Create`,
                employeeCode: Date.now() % 100000000,
                sales: req.body
            };
            req.session.notification=[enumm.notification.Error,'Supplier not updated !'];
            res.render(`${area}/create`);
        });
    } else {
        await db.detailsInfo.create(req.body)
            .then((result) => {
                if (result) {
                    // res.redirect(`/portal-${area}-list`);
                    req.session.notification=[enumm.notification.Success,'Supplier created successfully !'];
                    res.redirect(`/portal-${area.toLowerCase()}-create`);
                } else {
                    res.locals = {
                        title: `${area} Create`,
                        employeeCode: Date.now() % 100000000
                    };
                    req.session.notification=[enumm.notification.Error,'Supplier not created !'];
                    res.render(`${area}/create`);
                    // res.redirect(`/portal-${area}-create`);
                }
            });
    }
};

module.exports.portalSupplierDelete_Get = async (req, res, next) => {
    const area = 'Supplier';
    if (req.params.id && req.params.id > 0) {
        await db.detailsInfo.destroy({
            where: {
                id: req.params.id
            },
        }).then(() => {
            req.session.notification=[enumm.notification.Success,'Supplier deleted successfully !'];
            res.redirect(`/portal-${area.toLowerCase()}-list`);
        });
    }
};

//--------------Supplier End-------------


//--------------Sales Start-------------
module.exports.portalSalesList = async (req, res, next) => {
    const area = 'Sales';
    res.locals = {
        title: `${area} List`
    };
    res.render(`${area}/index`);
};

module.exports.getPortalSalesListData = async (req, res, next) => {
    
    await db.sale.findAll({
        where: {
            [Op.and]: [{
                    date: {
                        [Op.between]: [new Date(req.params.fromDate), new Date(new Date(req.params.toDate).getTime() + 60 * 60 * 24 * 1000 - 1)]
                    }
                }
            ],
        },
        order: [
            ['date', 'ASC']
        ],
        raw: true
    }).then(sales => {
        if (sales) {
            var count = 1;
            sales.forEach(detail => {
                detail.sl = count++;
                detail.date = moment.utc(detail.date).format("DD-MM-YYYY");
                detail.totalSale = (detail.card + detail.card2 + detail.cheque + detail.cash).toFixed(3);
            });
            res.status(200).send(sales);
        } else {
            res.status(200).send();
        }
    });

};

module.exports.portalSalesCreate_Get = async (req, res, next) => {
    const area = 'Sales';

    if (req.params.id && req.params.id > 0) {
        await db.sale.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        }).then(sale => {
            getPaymentTypeDropDown().then(paymentTypeDD => {
                sale.date = moment.utc(sale.date).format("MM/DD/yyyy");
                res.locals = {
                    title: `${area} Create`,
                    sales: sale,
                    paymentTypeDD: paymentTypeDD
                };
                res.render(`${area}/create`);
            });
        });
    } else {
        getPaymentTypeDropDown().then(paymentTypeDD => {
            res.locals = {
                title: `${area} Create`,
                paymentTypeDD: paymentTypeDD
            };
            res.render(`${area}/create`);
        });
    }
};

module.exports.portalSalesCreate_Post = async (req, res, next) => {
    const area = 'Sales';
    req.body.date = moment.utc(req.body.date).format("yyyy-MM-DD");
    if (req.body.id && req.body.id > 0) {
        await db.sale.update(req.body, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            req.session.notification=[enumm.notification.Success,'Sales updated successfully !'];
            res.redirect(`/portal-${area.toLowerCase()}-list`);
        }).catch(function (err) {
            res.locals = {
                title: `Sales Create`,
                sales: req.body
            };
            req.session.notification=[enumm.notification.Error,'Sales not updated !'];
            res.render(`${area}/create`);
        });
    } else {
        await db.sale.create(req.body)
            .then(async result => {
                if (result) {
                    req.session.notification=[enumm.notification.Success,'Sales created successfully !'];
                    res.redirect(`/portal-${area.toLowerCase()}-create`);
                } else {
                    res.locals = {
                        title: `Sales Create`,
                        sales: req.body
                    };
                    req.session.notification=[enumm.notification.Error,'Sales not created !'];
                    res.render(`${area}/create`);
                    // res.redirect(`/portal-${area}-create`);
                }
            });
    }
};

module.exports.portalSalesDelete_Get = async (req, res, next) => {
    const area = 'Sales';
    if (req.params.id && req.params.id > 0) {
        await db.sale.destroy({
            where: {
                id: req.params.id
            },
        }).then(() => {
            req.session.notification=[enumm.notification.Success,'Sales deleted successfully !'];
            res.redirect(`/portal-${area}-list`);
        });
    }
};

//--------------Sales End-------------



//--------------Supply Start-------------
module.exports.portalSupplyList = async (req, res, next) => {
    const area = 'Supply';
    res.locals = {
        title: `${area} List`
    };
    res.render(`${area}/index`);
};

module.exports.getPortalSupplyListData = async (req, res, next) => {
    await db.supply.findAll({
        where: {
            [Op.and]: [{
                    date: {
                        [Op.between]: [new Date(req.params.fromDate), new Date(new Date(req.params.toDate).getTime() + 60 * 60 * 24 * 1000 - 1)]
                    }
                }
            ],
        },
        attributes: {
            exclude: ['paymentTypeId', 'isActive', 'createdAt', 'updatedAt']
        },
        include: [{
                model: db.paymentType,
                attributes: ['name']
            },
            {
                model: db.detailsInfo,
                attributes: ['name']
            }
        ],
        order: [
            ['date', 'ASC']
        ],
        raw: true
    }).then(supply => {
        if (supply) {
            var count = 1;
            supply.forEach(detail => {
                detail.sl = count++;
                detail.date = moment.utc(detail.date).format("DD-MM-yyyy");
            });
            res.status(200).send(supply);
        } else {
            res.status(200).send();
        }
    });
};


module.exports.portalSupplyView_Get = async (req, res, next) => {
    const area = 'Supply';
    // await db.supply.findOne({})
    if (req.params.id && req.params.id > 0) {
        await db.supply.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        }).then(supply => {
            const files = getFiles(req.params.id, req);
            // console.log(files)
            getSupplierDropDown().then(supplierDD => {
                getPaymentTypeDropDown().then(paymentTypeDD => {
                    supply.date = moment.utc(supply.date).format("MM/DD/yyyy");
                    res.locals = {
                        title: `${area} Create`,
                        supply: supply,
                        supplierDD: supplierDD,
                        paymentTypeDD: paymentTypeDD,
                        viewMode: true,
                        files: files
                    };
                    res.render(`${area}/create`);
                })
            })
        });
    } else {
        res.locals = {
            title: `${area} List`
        };
        res.render(`${area}/index`);
    }
};


module.exports.portalSupplyFileDownload = async (req, res, next) => {
    const mainPath = path.join(__dirname, '..', '..', 'public', 'SupplyInvoices', 'ID_' + req.params.id, req.params.fileName);
    if (fs.existsSync(mainPath)) {
        res.download(mainPath)
    } else {
        res.redirect('/login')
    }
};

function getFiles(userId, req) {
    if (userId) {
        // req.protocol + '://' + req.get('host'),
        const mainPath = path.join(__dirname, '..', '..', 'public', 'SupplyInvoices', 'ID_' + userId);
        const downloadPath = path.join('public', 'SupplyInvoices', 'ID_' + userId);
        //reading directory in synchronous way
        if (fs.existsSync(mainPath)) {
            var files = fs.readdirSync(mainPath);
            var results = [];
            var count = 1;
            files.forEach(element => {
                // console.log(downloadPath.replace('\\','/'));
                results.push({
                    id: count++,
                    name: element,
                    link: path.join(downloadPath, element)
                })
            });
            return results;
        } else {
            return [];
        }

    } else {
        return [];
    }
}

module.exports.portalSupplyCreate_Get = async (req, res, next) => {
    const area = 'Supply';
    await db.supply.findOne({})
    if (req.params.id && req.params.id > 0) {
        await db.supply.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        }).then(supply => {
            getSupplierDropDown().then(supplierDD => {
                getPaymentTypeDropDown().then(paymentTypeDD => {
                    supply.date = moment.utc(supply.date).format("MM/DD/yyyy");
                    res.locals = {
                        title: `${area} Create`,
                        supply: supply,
                        supplierDD: supplierDD,
                        paymentTypeDD: paymentTypeDD,
                    };
                    res.render(`${area}/create`);
                })
            })
        });
    } else {
        getSupplierDropDown().then(supplierDD => {
            getPaymentTypeDropDown().then(paymentTypeDD => {
                res.locals = {
                    title: `${area} Create`,
                    supplierDD: supplierDD,
                    paymentTypeDD: paymentTypeDD
                };
                res.render(`${area}/create`);
            });
        });
    }
};

module.exports.portalSupplyCreate_Post = async (req, res, next) => {
    const area = 'Supply';
    const form = formidable({});
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.locals = {
                title: 'Supply Create',
            };
            res.render(`${area}/create`);
        } else {
            fields.date = moment.utc(fields.date).format("yyyy-MM-DD");
            if (fields.id && fields.id > 0) {
                await db.supply.update(fields, {
                    where: {
                        id: fields.id
                    }
                }).then(() => {
                    // req.body.id=fields.id;
                    const oldName = path.join(req.body.mainPath, req.body.folderName);
                    const newName = path.join(req.body.mainPath, "ID_" + fields.id);
                    // fs.rmdirSync(newName, { recursive: true, force: true });
                    // del(newName);
                    fs.rename(oldName, newName, function (err) {
                        if (err) {
                            console.log(err)
                            del(oldName);
                            res.locals = {
                                title: 'Supply Create',
                                sales: req.body
                            };
                            req.session.notification=[enumm.notification.Error,'Supply not updated !'];
                            res.render(`${area}/create`);
                            // fs.rmdirSync(oldName, { recursive: true, force: true });
                        } else {
                            req.session.notification=[enumm.notification.Success,'Supply updated successfully !'];
                            res.redirect(`/portal-${area.toLowerCase()}-list`);
                        }
                    });
                }).catch(function (err) {
                    req.session.notification=[enumm.notification.Error,'Supply not updated !'];
                    res.redirect(`/portal-${area.toLowerCase()}-create`);
                });
            } else {
                fields.id = null;
                await db.supply.create(fields)
                    .then(async (result) => {
                        if (result) {
                            const oldName = path.join(req.body.mainPath, req.body.folderName);
                            const newName = path.join(req.body.mainPath, "ID_" + result.id);
                            fs.rename(oldName, newName, function (err) {
                                if (err) {
                                    req.session.notification=[enumm.notification.Error,'File permission error !'];
                                    del(oldName);
                                    // fs.rmSync(oldName, { recursive: true, force: true });
                                } else {
                                    req.session.notification=[enumm.notification.Success,'Supply created successfully !'];
                                    res.redirect(`/portal-${area.toLowerCase()}-create`);
                                }
                            });
                        }
                    }).catch(function (err) {
                        req.session.notification=[enumm.notification.Error,'Supply not created !'];
                        res.redirect(`/portal-${area.toLowerCase()}-create`);
                    });
            }
        };
    });

};

const deleteFolderRecursive = function (directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file, index) => {
            const curPath = path.join(directoryPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursive(curPath);
            } else {
                // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(directoryPath);
    }
};

module.exports.portalSupplyCreate_Post_Pre = async (req, res, next) => {
    const folderName = Date.now().toString();
    var mainPath = path.join(__dirname, '..', '..', 'public', 'SupplyInvoices');

    if (!fs.existsSync(mainPath)) {
        await fs.mkdirSync(mainPath);
    }

    var uploadPath = path.join(mainPath, folderName);
    if (!fs.existsSync(uploadPath)) {
        await fs.mkdirSync(uploadPath);
    }

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath)
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    });

    var upload = multer({
        storage: storage
    }).array('file');

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.locals = {
                title: 'Supply Create',
            };
            res.render(`${area}/create`);
        } else if (err) {
            res.locals = {
                title: 'Supply Create',
            };
            res.render(`${area}/create`);
        } else {
            req.body.folderName = folderName;
            req.body.mainPath = mainPath;
        }
    });
    next();
};


module.exports.portalSupplyDelete_Get = async (req, res, next) => {
    const area = 'Supply';
    if (req.params.id && req.params.id > 0) {
        await db.supply.destroy({
            where: {
                id: req.params.id
            },
        }).then(() => {
            req.session.notification=[enumm.notification.Success,'Supply deleted successfully !'];
            res.redirect(`/portal-${area.toLowerCase()}-list`);
        });
    }
};

//--------------Supply End-------------


//--------------Wages Start-------------

module.exports.portalWagesList = async (req, res, next) => {
    const area = 'Wages';
    res.locals = {
        title: `${area} List`
    };
    res.render(`${area}/index`);
};

module.exports.getPortalWagesListData = async (req, res, next) => {
    await db.employeeWage.findAll({
        where: {
            [Op.and]: [{
                    dateFrom: {
                        [Op.between]: [new Date(req.params.fromDate), new Date(new Date(req.params.toDate).getTime() + 60 * 60 * 24 * 1000 - 1)]
                    }
                }
            ],
        },
        attributes: {
            exclude: ['paymentTypeId', 'isActive', 'createdAt', 'updatedAt']
        },
        include: {
            model: db.detailsInfo,
            attributes: ['name']
        },
        order: [
            ['dateFrom', 'ASC']
        ],
        raw: true
    }).then(data => {
        if (data) {
            var count = 1;
            data.forEach(detail => {
                detail.sl = count++;
                detail.dateFrom = moment.utc(detail.dateFrom).format("DD-MM-yyyy");
                detail.dateTo = moment.utc(detail.dateTo).format("DD-MM-yyyy");
                detail.totalWage = detail.salary + detail.payg + detail.super + detail.annual + detail.cash;
            })
            res.status(200).send(data);
        } else {
            res.status(200).send();
        }
    });
};

module.exports.portalWagesCreate_Get = async (req, res, next) => {
    const area = 'Wages';
    if (req.params.id && req.params.id > 0) {
        await db.employeeWage.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        }).then(wages => {
            getDetailsInfoDropDown().then(employeeDD => {
                wages.dateFrom = moment.utc(wages.dateFrom).format("MM/DD/yyyy");
                wages.dateTo = moment.utc(wages.dateTo).format("MM/DD/yyyy");
                res.locals = {
                    title: `${area} Create`,
                    wages: wages,
                    employeeDD: employeeDD
                };
                res.render(`${area}/create`);
            });
        });
    } else {
        getDetailsInfoDropDown().then(employeeDD => {
            res.locals = {
                title: `${area} Create`,
                employeeDD: employeeDD
            };
            res.render(`${area}/create`);
        });
    }
};

module.exports.portalWagesCreate_Post = async (req, res, next) => {
    const area = 'Wages';
    req.body.dateFrom = moment.utc(req.body.dateFrom).format("yyyy-MM-DD");
    req.body.dateTo = moment.utc(req.body.dateTo).format("yyyy-MM-DD");
    console.log(req.body)
    if (req.body.id && req.body.id > 0) {
        await db.employeeWage.update(req.body, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            req.session.notification=[enumm.notification.Success,'Wage successfully updated.'];
            res.redirect(`/portal-${area.toLowerCase()}-list`);
        }).catch(function (err) {
            // res.locals = {
            //     title: 'Supply Create',
            //     sales: req.body
            // };
            // res.render(`${area}/create`);
            req.session.notification=[enumm.notification.Error,'Wage not created !'];
            res.redirect(`/portal-${area.toLowerCase()}-create`);
        });
    } else {
        await db.employeeWage.create(req.body)
            .then((result) => {
                if (result) {
                    // res.redirect(`/portal-${area}-list`);
                    req.session.notification=[enumm.notification.Success,'Wage created successfully !'];
                    res.redirect(`/portal-${area.toLowerCase()}-create`);
                } else {
                    res.locals = {
                        title: 'Wages Create',
                        wages: req.body
                    };
                    req.session.notification=[enumm.notification.Error,'Wage not created !'];
                    res.render(`${area}/create`);
                    // res.redirect(`/portal-${area}-create`);
                }
            });
    }
};

module.exports.portalWagesDelete_Get = async (req, res, next) => {
    const area = 'Wages';
    if (req.params.id && req.params.id > 0) {
        await db.employeeWage.destroy({
            where: {
                id: req.params.id
            },
        }).then(() => {
            req.session.notification=[enumm.notification.Success,'Wage deleted successfully !'];
            res.redirect(`/portal-${area}-list`);
        });
    }
};

//--------------Wages End-------------

//--------------Expense Start-------------
module.exports.portalExpenseList = async (req, res, next) => {
    const area = 'Expense';
    res.locals = {
        title: `${area} List`
    };
    res.render(`${area}/index`);
};

module.exports.getPortalExpenseListData = async (req, res, next) => {
    await db.expense.findAll({
        where: {
            [Op.and]: [{
                    date: {
                        [Op.between]: [new Date(req.params.fromDate), new Date(new Date(req.params.toDate).getTime() + 60 * 60 * 24 * 1000 - 1)]
                    }
                }
            ],
        },
        attributes: {
            exclude: ['isActive', 'createdAt', 'updatedAt']
        },
        order: [
            ['date', 'ASC']
        ],
        raw: true
    }).then(data => {
        if (data) {
            var count = 1;
            data.forEach(detail => {
                detail.sl = count++;
                detail.date = moment.utc(detail.date).format("DD-MM-yyyy");
                detail.totalExpense = detail.shopRent + detail.accountantFee + detail.bankFee + detail.gst + detail.electricityBill+ detail.mobileBill+ detail.truckBill+ detail.insuranceFee+ detail.others;
            })
            res.status(200).send(data);
        } else {
            res.status(200).send();
        }
    });
};

module.exports.portalExpenseCreate_Get = async (req, res, next) => {
    const area = 'Expense';
    if (req.params.id && req.params.id > 0) {
        await db.expense.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        }).then(expense => {
            expense.date = moment.utc(expense.date).format("MM/DD/yyyy");
            res.locals = {
                title: `${area} Create`,
                expense: expense
            };
            res.render(`${area}/create`);
        });
    } else {
        res.locals = {
            title: `${area} Create`,
        };
        res.render(`${area}/create`);
    }
};

module.exports.portalExpenseCreate_Post = async (req, res, next) => {
    const area = 'Expense';
    req.body.date = moment.utc(req.body.date).format("yyyy-MM-DD");
    if (req.body.id && req.body.id > 0) {
        await db.expense.update(req.body, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            req.session.notification=[enumm.notification.Success,'Expense updated successfully !'];
            res.redirect(`/portal-${area.toLowerCase()}-list`);
        }).catch(function (err) {
            res.locals = {
                title: `${area} Create`,
                sales: req.body
            };
            res.render(`${area}/create`);
        });
    } else {
        await db.expense.create(req.body)
            .then((result) => {
                if (result) {
                    // res.redirect(`/portal-${area}-list`);
                    req.session.notification=[enumm.notification.Success,'Expense created successfully !'];
                    res.redirect(`/portal-${area.toLowerCase()}-create`);
                } else {
                    req.session.notification=[enumm.notification.Error,'Expense not created !'];
                    res.redirect(`/portal-${area.toLowerCase()}-create`);
                }
            });
    }
};

module.exports.portalExpenseDelete_Get = async (req, res, next) => {
    const area = 'Expense';
    if (req.params.id && req.params.id > 0) {
        await db.expense.destroy({
            where: {
                id: req.params.id
            },
        }).then(() => {
            req.session.notification=[enumm.notification.Success,'Expense deleted successfully !'];
            res.redirect(`/portal-${area.toLowerCase()}-list`);
        });
    }
};

//--------------Expense End-------------


//--------------Report Start-------------
module.exports.portalMasterReport_Get = async (req, res, next) => {
    const area = 'Report';
    res.locals = {
        title: 'Master Report'
    };
    res.render(`${area}/search`);
};

module.exports.portalMasterReport_Post = async (req, res, next) => {
    const area = 'Report';
    const fromDate = req.body.fromDate //?req.body.formDate:new Date().toISOString().substr(0,10);
    // console.log(req.body);
    const toDate = req.body.toDate //?req.body.toDate:new Date().toISOString().substr(0,10);
    db.sequelize.query('CALL SP_Master_Report (:fromDate,:toDate)', {
            replacements: {
                fromDate: fromDate,
                toDate: toDate
            }
        })
        .then(async function (results) {
            var totalSale = 0;
            var totalExpense = 0;
            results.forEach(element => {
                element.Date = moment.utc(element.Date).format("DD-MM-yyyy"),
                    totalSale += element.Cash ? element.Cash : 0,
                    totalSale += element.Card ? element.Card : 0,
                    totalSale += element.Cheque ? element.Cheque : 0,
                    totalExpense += element.Supplier ? element.Supplier : 0,
                    totalExpense += element.Salary ? element.Salary : 0,
                    totalExpense += element.Expense ? element.Expense : 0
            });
            res.locals = {
                title: `${area}`,
                results: results,
                todayDate: moment.utc(Date.now()).format("DD-MM-yyyy"),
                fromDate: moment.utc(fromDate).format("DD-MM-yyyy"),
                toDate: moment.utc(toDate).format("DD-MM-yyyy"),
                totalExpense: totalExpense.toFixed(2),
                totalSale: totalSale.toFixed(2),
                profit: (totalSale - totalExpense).toFixed(2)
            };
            res.render(`${area}/Master`);
        })
        .catch(function (err) {
            res.locals = {
                title: `${area}`,
                results: [],
                todayDate: new Date().toISOString().substr(0, 10),
                fromDate: moment.utc(fromDate).format("DD-MM-yyyy"),
                toDate: moment.utc(toDate).format("DD-MM-yyyy"),
                totalExpense: 0,
                totalSale: 0,
                profit: 0
            };
            res.render(`${area}/Master`);
        });

};
//--------------Report End-------------


//--------------Employee Attendance Start-------------
module.exports.portalEmployeeCash_Post = async (req, res, next) => {
    const date = new Date();
    await db.dailyCash.findOne({
        where: {
            [Op.and]: [
                sequelize.where(sequelize.fn('month', sequelize.col("date")), date.getMonth() + 1),
                sequelize.where(sequelize.fn('day', sequelize.col("date")), date.getDate())
            ]
        },
        raw: true
    }).then(async result => {
        if (result) {
            await db.dailyCash.update({
                    cash: req.body.cash
                }, {
                    where: {
                        id: {
                            [Op.eq]: result.id
                        }
                    }
                })
                .then((result) => {
                    res.redirect("/portal-attendance-entry")
                });
        } else {
            await db.dailyCash.create({
                    date: Date.now(),
                    cash: req.body.cash,
                    userId: req.currentUser
                })
                .then((result) => {
                    res.redirect("/portal-attendance-entry")
                });
        };
    })

};

module.exports.portalEmployeeAttendance_Get = async (req, res, next) => {
    const area = 'Attendance';
    const date = new Date();
    getAttendanceTypeDropDown().then(async getAttendanceTypeDropDown => {
        await db.dailyCash.findOne({
            where: {
                [Op.and]: [
                    sequelize.where(sequelize.fn('month', sequelize.col("date")), date.getMonth() + 1),
                    sequelize.where(sequelize.fn('day', sequelize.col("date")), date.getDate())
                ]
            },
            raw: true
        }).then(async result => {
            res.locals = {
                title: 'Employee Attendance',
                getAttendanceTypeDD: getAttendanceTypeDropDown,
                dailyCash: result ? result : undefined,
                // running: result.find((x) => x['attendanceType.code'] == enumm.attendanceType.Out)
            };
            if(req.params.id && req.params.id>0){
                res.render(`${area}/index`);
            }
            else{
                res.render(`${area}/index_pending`);
            }
        });

    });
};


module.exports.portalAttendanceEntry_Get = async (req, res, next) => {
    const area = 'Attendance';
    const date = new Date();
    getAttendanceTypeDropDown().then(async getAttendanceTypeDropDown => {
        res.locals = {
            title: 'Attendance Entry',
            getAttendanceTypeDD: getAttendanceTypeDropDown
        };
        res.render(`${area}/entry`);
    });
};


module.exports.portalAttendanceAddNew_Post = async (req, res, next) => {
    console.log(req.body)
    if(req.body.attendanceTypeId && req.body.employeeId && req.body.attendanceDate){
        const myCustomDate=new CustomDateTime(req.body.attendanceDate+"+10:00");
        await db.attendance.create({
            dateTime: myCustomDate.getUTC(),
            code: moment().format("yyyyDDmm")+req.body.attendanceTypeId,
            attendanceTypeId: req.body.attendanceTypeId,
            userId: req.body.employeeId,
            isApproved:req.body.isApproved
        })
        .then((result) => {
            res.status(200).send({status:true});
        });
    }
    else{
        res.send({status:false});
    }
};


module.exports.portalEmployeeAttendance_Approve = async (req, res, next) => {
    
    if(req.params.userId && req.params.date){
        const date = new Date(req.params.date);
        await db.attendance.update({
            isApproved:1
        }, {
            where: {
                [Op.and]: [{
                        userId: {
                            [Op.eq]: req.params.userId
                        }
                    },
                    sequelize.where(sequelize.fn('month', sequelize.col("dateTime")), date.getMonth() + 1),
                    sequelize.where(sequelize.fn('day', sequelize.col("dateTime")), date.getDate())
                ]
            }
        })
        .then((result) => {
            req.session.notification=[enumm.notification.Success,'Attendance approved successfully !'];
            res.redirect("/portal-employee-attendance/0");
        });
    }
    else{
        res.redirect("/portal-employee-attendance/0");
    }
};

module.exports.portalEmployeeAttendanceEntry = async (req, res, next) => {
    var where={};
    const myCustomDate=new CustomDateTime(req.params.date);
    if(req.params.userId && req.params.date){
        where={
            [Op.and]: [{
                    userId: {
                        [Op.eq]: req.params.userId
                    }
                },
                sequelize.where(sequelize.fn('month', sequelize.col("dateTime")), myCustomDate.getMonth()),
                sequelize.where(sequelize.fn('day', sequelize.col("dateTime")), myCustomDate.getDate()),
            ],
        };
    }else{
        const date = new Date();
        where={
            [Op.and]: [{
                    userId: {
                        [Op.eq]: req.currentUser
                    }
                },
                sequelize.where(sequelize.fn('month', sequelize.col("dateTime")), date.getMonth() + 1),
                sequelize.where(sequelize.fn('day', sequelize.col("dateTime")), date.getDate()),
            ],
        };
    }
    await db.attendance.findAll({
        where: where,
        attributes: ['dateTime','id','userId'],
        order: [
            // Will escape title and validate ASC against a list of valid direction parameters
            ['dateTime', 'ASC']
        ],
        include: [{
                model: db.attendanceType,
                attributes: ['name']
            },
            {
                model: db.user,
                attributes: ['username']
            }
        ],
        raw: true
    }).then(result => {
        // console.log(result);
        if (result) {
            var count = 1;
            result.forEach(detail => {
                const defaultDateTime= new CustomDateTime(detail.dateTime)// moment(detail.dateTime);
                detail.sl = count++;
                detail.realDateTime = moment.utc(result.dateTime).format("DD-MM-YYYYTHH:mm:ss");
                detail.realDate = moment.utc(result.dateTime).format("DD-MM-YYYY");
                detail.ausDate = defaultDateTime.getAUS("DD-MM-YYYY");
                detail.ausTime = defaultDateTime.getAUS("hh:mm:ss A")//new Date(detail.dateTime).toLocaleString('en-US', { hour12: false });
                detail.ausDateTime = defaultDateTime.getAUS("YYYY-MM-DDTHH:mm:ss")///"2022-08-09T06:29"//new Date(detail.dateTime).toLocaleString('en-US', { hour12: false });
            })
            res.status(200).send(result);
        } else {
            res.status(200).send();
        }
    });
};

module.exports.portalEmployeeAttendanceUpdate_Post = async (req, res, next) => {
    const myCustomDate=new CustomDateTime(req.params.newDate+"+10:00");
    if(req.params.id && req.params.newDate && new Date(Date.parse(req.params.newDate))){
        await db.attendance.update({
            dateTime:myCustomDate.getUTC()
        }, {
            where: {
                [Op.and]: [{
                        id: {
                            [Op.eq]: req.params.id
                        }
                    }
                ]
            }
        })
        .then((result) => {
            res.send({status:true});
        });
    }
    else{
        res.send({status:false});
    }
};


module.exports.portalEmployeeAttendance_Edit = async (req, res, next) => {
    const area = 'Attendance';
    if(req.params.userId && req.params.date){
        const date = new Date(req.params.date);
        await db.attendance.update({
            isApproved:1
        }, {
            where: {
                [Op.and]: [{
                        userId: {
                            [Op.eq]: req.params.userId
                        }
                    },
                    sequelize.where(sequelize.fn('month', sequelize.col("dateTime")), date.getMonth() + 1),
                    sequelize.where(sequelize.fn('day', sequelize.col("dateTime")), date.getDate())
                ]
            }
        })
        .then((result) => {
            res.locals = {
                title: `${area} Create`,
                sales: req.body
            };
            res.render(`${area}/create`);
        });
    }
    else{
        res.redirect("/portal-employee-attendance/0");
    }
};

module.exports.portalEmployeeAttendance_Post = async (req, res, next) => {
    const date = new CustomDateTime(Date.now());
    await db.attendance.findOne({
        where: {
            [Op.and]: [{
                attendanceTypeId: {
                    [Op.eq]: req.params.attendanceFor,
                }
            }, {
                userId: {
                    [Op.eq]: req.currentUser
                }
            },
            sequelize.where(sequelize.fn('month', sequelize.col("dateTime")), date.getMonth()),
            sequelize.where(sequelize.fn('day', sequelize.col("dateTime")), date.getDate())
        ]
        },
        include: {
            model: db.attendanceType,
            attributes: ['code']
        },
        raw: true
    }).then(async result => {
        if (result && result['attendanceType.code'] != enumm.attendanceType.Out) {
            await db.attendance.update({
                    dateTime: Date.now()
                }, {
                    where: {
                        [Op.and]: [{
                            attendanceTypeId: {
                                [Op.eq]: req.params.attendanceFor,
                            }
                        }, {
                            userId: {
                                [Op.eq]: req.currentUser
                            }
                        }]
                    }
                })
                .then((result) => {
                    res.status(200).json({
                        status: 200,
                        url: '/Attendance/index'
                    });
                });
        } else if (result && result['attendanceType.code'] == enumm.attendanceType.Out) {
            res.status(200).json({
                status: 200,
                url: '/Attendance/index'
            });
        } else {
            const myCustomDate=new CustomDateTime(moment());
            await db.attendance.create({
                dateTime: myCustomDate.getUTC(),
                code: moment().format("yyyyDDmm")+req.currentUser,
                attendanceTypeId: req.params.attendanceFor,
                userId: req.currentUser
            })
            .then((result) => {
                res.status(200).json({
                    status: 200,
                    url: '/Attendance/index'
                });
            });
        }
    });
};

module.exports.portalEmployeeAttendanceListData_Approved = async (req, res, next) => {
    var where = {};
    if(req.params.fromDate && req.params.toDate){
        where={
            [Op.and]: [{
                    isApproved: {
                        [Op.eq]: 1
                    },
                    dateTime: {
                        [Op.between]: [new Date(req.params.fromDate), new Date(new Date(req.params.toDate).getTime() + 60 * 60 * 24 * 1000 - 1)]
                    },
                }
            ],
        };
    }else{
        where={
            [Op.and]: [{
                    isApproved: {
                        [Op.eq]: 1
                    }
                }
            ],
        };
    }

    await db.attendance.findAll({
        where: where,
        attributes: ['id','dateTime', 'userId'],
        order: [
            // Will escape title and validate ASC against a list of valid direction parameters
            ['dateTime', 'ASC']
        ],
        include: [{
                model: db.attendanceType,
                attributes: ['code', 'name']
            },
            {
                model: db.user,
                attributes: ['username']
            }
        ],
        raw: true
    }).then(result => {
        result.forEach(element => {
            element.date=new CustomDateTime(element.dateTime).getUTC("DD-MM-YYYY")
        });
        if (result) {
            const groupData = groupBy(result, result => result.userId);
            // console.log(data);
            var listData = [];
            var lastBreakStart = 0;
            var count = 1;
            groupData.forEach(group => {
                const data = groupBy(group, group => group.date);
                data.forEach(result => {
                    // if(result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In) && result.find((x) => x['attendanceType.code'] == enumm.attendanceType.Out) && (result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In))){
                    if(result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In) ){
                        var totalWorkingHours = 0;
                        try {
                            totalWorkingHours = (//Math.abs(
                                result.find((x) => x['attendanceType.code'] == enumm.attendanceType.Out).dateTime -
                                result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In).dateTime
                            ) / (1000 * 60);
                        } catch (error) {}

                        var totalBreakHours = 0;
                        result.forEach(element => {
                            if (element['attendanceType.code'] == enumm.attendanceType.BreakStart) {
                                lastBreakStart = element.dateTime;
                            } else if (element['attendanceType.code'] == enumm.attendanceType.BreakEnd) {
                                if (lastBreakStart != 0) {
                                    // console.log(lastBreakStart, element.dateTime)
                                    totalBreakHours += parseFloat((Math.abs(
                                        element.dateTime -
                                        lastBreakStart
                                    ) / (1000 * 60)));//36e5));
                                    lastBreakStart = 0;
                                }
                            }
                        });
                        if (lastBreakStart != 0) {
                            totalBreakHours += parseFloat((Math.abs(
                                result.find((x) => x['attendanceType.code'] == enumm.attendanceType.Out).dateTime -
                                lastBreakStart
                            ) / (1000 * 60)));//36e5));
                            lastBreakStart = 0;
                        };
                        totalBreakHours = parseFloat(totalBreakHours);
                        listData.push({
                            sl: count++,
                            realDateTime: result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In).dateTime,
                            dateTime: result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In)?
                                new CustomDateTime(result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In).dateTime).getAUS("DD-MM-YYYY")
                                :'Missing',//moment.utc(result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In).dateTime).format("DD-MM-YYYY"),
                            dayIn: result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In)?
                                new CustomDateTime(result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In).dateTime).getAUS("hh:mm:ss A")
                                :'Missing',
                            dayOut: result.find((x) => x['attendanceType.code'] == enumm.attendanceType.Out)?
                                new CustomDateTime(result.find((x) => x['attendanceType.code'] == enumm.attendanceType.Out).dateTime).getAUS("hh:mm:ss A")
                                :'Missing',
                            workingHours: timeConvert(totalWorkingHours),
                            totalBreak: timeConvert(totalBreakHours),
                            actualWorkingHours: timeConvert(totalWorkingHours - totalBreakHours),
                            userId:result[0].userId,
                            userName:result[0]['user.username']
                        })
                    }
                });
            });
            res.status(200).send(listData);
        } else {
            res.status(200).send();
        }
    });
};

module.exports.portalEmployeeAttendanceListData_Pending = async (req, res, next) => {
    if (req.roleCode == enumm.role.Admin || req.roleCode == enumm.role.SuperUser) {

        var where = {};
        if(req.params.fromDate && req.params.toDate){
            where={
                [Op.and]: [{
                        isApproved: {
                            [Op.eq]: 0
                        },
                        dateTime: {
                            [Op.between]: [new Date(req.params.fromDate), new Date(new Date(req.params.toDate).getTime() + 60 * 60 * 24 * 1000 - 1)]
                        },
                    }
                ],
            };
        }else{
            where={
                [Op.and]: [{
                        isApproved: {
                            [Op.eq]: 0
                        }
                    }
                ],
            };
        }
        

        await db.attendance.findAll({
            where: where,
            attributes: ['id','dateTime', 'userId'],
            order: [
                // Will escape title and validate ASC against a list of valid direction parameters
                ['dateTime', 'ASC']
            ],
            include: [{
                    model: db.attendanceType,
                    attributes: ['code', 'name']
                },
                {
                    model: db.user,
                    attributes: ['username']
                }
            ],
            raw: true
        }).then(result => {
            result.forEach(element => {
                element.date=new CustomDateTime(element.dateTime).getUTC("DD-MM-YYYY") //moment.utc(element.dateTime).format("DD-MM-YYYY");
            });
            if (result) {
                const groupData = groupBy(result, result => result.userId);
                // console.log(data);
                var listData = [];
                var lastBreakStart = 0;
                var count = 1;
                groupData.forEach(group => {
                    const data = groupBy(group, group => group.date);
                    data.forEach(result => {
                        // if(result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In) && result.find((x) => x['attendanceType.code'] == enumm.attendanceType.Out) && (result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In))){
                        if(result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In) ){
                            var totalWorkingHours = 0;
                            try {
                                totalWorkingHours = (//Math.abs(
                                    result.find((x) => x['attendanceType.code'] == enumm.attendanceType.Out).dateTime -
                                    result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In).dateTime
                                ) / (1000 * 60);
                            } catch (error) {}
        
                            var totalBreakHours = 0;
                            result.forEach(element => {
                                if (element['attendanceType.code'] == enumm.attendanceType.BreakStart) {
                                    lastBreakStart = element.dateTime;
                                } else if (element['attendanceType.code'] == enumm.attendanceType.BreakEnd) {
                                    if (lastBreakStart != 0) {
                                        // console.log(lastBreakStart, element.dateTime)
                                        totalBreakHours += parseFloat((Math.abs(
                                            element.dateTime -
                                            lastBreakStart
                                        ) / (1000 * 60)));//36e5));
                                        lastBreakStart = 0;
                                    }
                                }
                            });
                            if (lastBreakStart != 0) {
                                totalBreakHours += parseFloat((Math.abs(
                                    result.find((x) => x['attendanceType.code'] == enumm.attendanceType.Out).dateTime -
                                    lastBreakStart
                                ) / (1000 * 60)));//36e5));
                                lastBreakStart = 0;
                            };
                            totalBreakHours = parseFloat(totalBreakHours);
                            listData.push({
                                sl: count++,
                                realDateTime: result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In).dateTime,
                                dateTime: result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In)?
                                    new CustomDateTime(result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In).dateTime).getAUS("DD-MM-YYYY")
                                    :'Missing',//moment.utc(result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In).dateTime).format("DD-MM-YYYY"),
                                dayIn: result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In)?
                                    new CustomDateTime(result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In).dateTime).getAUS("hh:mm:ss A")
                                    :'Missing',
                                dayOut: result.find((x) => x['attendanceType.code'] == enumm.attendanceType.Out)?
                                    new CustomDateTime(result.find((x) => x['attendanceType.code'] == enumm.attendanceType.Out).dateTime).getAUS("hh:mm:ss A")
                                    :'Missing',
                                workingHours: timeConvert(totalWorkingHours),
                                totalBreak: timeConvert(totalBreakHours),
                                actualWorkingHours: timeConvert(totalWorkingHours - totalBreakHours),
                                userId:result[0].userId,
                                userName:result[0]['user.username']
                            })
                        }
                    });
                });
                res.status(200).send(listData);
            } else {
                res.status(200).send();
            }
        });
    } else {
        const date = new Date();
        await db.attendance.findAll({
            where: {
                [Op.and]: [{
                        userId: {
                            [Op.eq]: req.currentUser
                        }
                    },
                    sequelize.where(sequelize.fn('month', sequelize.col("dateTime")), date.getMonth() + 1),
                    sequelize.where(sequelize.fn('day', sequelize.col("dateTime")), date.getDate()),
                ],
            },
            attributes: ['dateTime'],
            order: [
                // Will escape title and validate ASC against a list of valid direction parameters
                ['dateTime', 'ASC']
            ],
            include: [{
                    model: db.attendanceType,
                    attributes: ['name']
                },
                {
                    model: db.user,
                    attributes: ['username']
                }
            ],
            raw: true
        }).then(result => {
            if (result) {
                var count = 1;
                result.forEach(detail => {
                    detail.sl = count++;
                    detail.date = moment.utc(result.dateTime).format("DD-MM-YYYY");
                })
                res.status(200).send(result);
            } else {
                res.status(200).send();
            }
        });
    }
};



module.exports.portalAttendanceHistory_Get = async (req, res, next) => {
    const area = 'Attendance';
    res.locals = {
        title: 'Attendance Entry',
        getAttendanceTypeDD: getAttendanceTypeDropDown
    };
    res.render(`${area}/history`);
}
module.exports.portalAttendanceHistoryData_Get = async (req, res, next) => {
    var where = {};
    if(req.params.fromDate && req.params.toDate){
        where={
            [Op.and]: [{
                    isApproved: {
                        [Op.eq]: 0
                    },
                    userId: {
                        [Op.eq]: req.currentUser
                    },
                    dateTime: {
                        [Op.between]: [new Date(req.params.fromDate), new Date(new Date(req.params.toDate).getTime() + 60 * 60 * 24 * 1000 - 1)]
                    },
                }
            ],
        };
    }else{
        where={
            [Op.and]: [{
                    isApproved: {
                        [Op.eq]: 1
                    },
                    userId: {
                        [Op.eq]: req.currentUser
                    },
                }
            ],
        };
    }
    

    await db.attendance.findAll({
        where: where,
        attributes: ['id','dateTime', 'userId'],
        order: [
            // Will escape title and validate ASC against a list of valid direction parameters
            ['dateTime', 'ASC']
        ],
        include: [{
                model: db.attendanceType,
                attributes: ['code', 'name']
            },
            {
                model: db.user,
                attributes: ['username']
            }
        ],
        raw: true
    }).then(result => {
        result.forEach(element => {
            element.date=moment.utc(element.dateTime).format("DD-MM-YYYY");
        });
        if (result) {
            const groupData = groupBy(result, result => result.userId);
            // console.log(data);
            var listData = [];
            var lastBreakStart = 0;
            var count = 1;
            groupData.forEach(group => {
                const data = groupBy(group, group => group.date);
                data.forEach(result => {
                    if(result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In) && result.find((x) => x['attendanceType.code'] == enumm.attendanceType.Out)){
                        const totalWorkingHours = (Math.abs(
                            result.find((x) => x['attendanceType.code'] == enumm.attendanceType.Out).dateTime -
                            result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In).dateTime
                        ) / (1000 * 60));
    
                        var totalBreakHours = 0;
                        result.forEach(element => {
                            if (element['attendanceType.code'] == enumm.attendanceType.BreakStart) {
                                lastBreakStart = element.dateTime;
                            } else if (element['attendanceType.code'] == enumm.attendanceType.BreakEnd) {
                                if (lastBreakStart != 0) {
                                    // console.log(lastBreakStart, element.dateTime)
                                    totalBreakHours += parseFloat((Math.abs(
                                        element.dateTime -
                                        lastBreakStart
                                    ) / (1000 * 60)));//36e5));
                                    lastBreakStart = 0;
                                }
                            }
                        });
                        if (lastBreakStart != 0) {
                            totalBreakHours += parseFloat((Math.abs(
                                result.find((x) => x['attendanceType.code'] == enumm.attendanceType.Out).dateTime -
                                lastBreakStart
                            ) / (1000 * 60)));//36e5));
                            lastBreakStart = 0;
                        };
                        totalBreakHours = parseFloat(totalBreakHours);
                        listData.push({
                            sl: count++,
                            realDateTime: result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In).dateTime,
                            dateTime: moment.utc(result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In).dateTime).format("DD-MM-YYYY"),
                            dayIn: result.find((x) => x['attendanceType.code'] == enumm.attendanceType.In).dateTime,
                            dayOut: result.find((x) => x['attendanceType.code'] == enumm.attendanceType.Out).dateTime,
                            workingHours: timeConvert(totalWorkingHours),
                            totalBreak: timeConvert(totalBreakHours),
                            actualWorkingHours: timeConvert(totalWorkingHours - totalBreakHours),
                            userId:result[0].userId,
                            userName:result[0]['user.username']
                        })
                    }
                });
            });
            res.status(200).send(listData);
        } else {
            res.status(200).send();
        }
    });
};

module.exports.portalAttendanceAddNew_Get = async (req, res, next) => {
    // getDetailsInfoDropDown().then(employeeDD => {
    //     getAttendanceTypeDropDown()
    // })
    const area = 'Attendance';
    res.locals = {
        title: 'Attendance Create',
        getAttendanceTypeDD: await getAttendanceTypeDropDown(),
        getEmployeeDD: await getDetailsInfoDropDown(),
    };
    res.render(`${area}/Add_New`);
}

module.exports.portalEmployeeAttendanceListData = async (req, res, next) => {
    const date = new Date();
    await db.attendance.findAll({
        where: {
            [Op.and]: [{
                    userId: {
                        [Op.eq]: req.currentUser
                    }
                },
                sequelize.where(sequelize.fn('month', sequelize.col("dateTime")), date.getMonth() + 1),
                sequelize.where(sequelize.fn('day', sequelize.col("dateTime")), date.getDate()),
            ],
        },
        attributes: ['dateTime'],
        order: [
            // Will escape title and validate ASC against a list of valid direction parameters
            ['dateTime', 'ASC']
        ],
        include: [{
                model: db.attendanceType,
                attributes: ['name']
            },
            {
                model: db.user,
                attributes: ['username']
            }
        ],
        raw: true
    }).then(result => {
        if (result) {
            var count = 1;
            result.forEach(detail => {
                detail.sl = count++;
                detail.date = moment.utc(result.dateTime).format("DD-MM-YYYY");
            })
            res.status(200).send(result);
        } else {
            res.status(200).send();
        }
    });
};

//--------------Employee Attendance End-------------


//--------------Tally Start-------------
module.exports.portalTallyCustomerList = async (req, res, next) => {
    const area = 'Tally';
    res.locals = {
        title: `${area} List`
    };
    res.render(`${area}/customerList`);
};

module.exports.getPortalTallyCustomerListData = async (req, res, next) => {
    await db.tallyCustomer.findAll({
        // where: {
        //     [Op.and]: [{
        //             date: {
        //                 [Op.between]: [new Date(req.params.fromDate), new Date(new Date(req.params.toDate).getTime() + 60 * 60 * 24 * 1000 - 1)]
        //             }
        //         }
        //     ],
        // },
        attributes: {
            exclude: ['isActive', 'createdAt', 'updatedAt']
        },
        order: [
            ['id', 'ASC']
        ],
        raw: true
    }).then(data => {
        if (data) {
            var count = 1;
            data.forEach(detail => {
                detail.sl = count++;
            });
            res.status(200).send(data);
        } else {
            res.status(200).send();
        }
    });
};

module.exports.portalTallyCustomerCreate_Get = async (req, res, next) => {
    const area = 'Tally';
    if (req.params.id && req.params.id > 0) {
        await db.tallyCustomer.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        }).then(tallyCustomer => {
            res.locals = {
                title: `${area} Customer Create`,
                tallyCustomer: tallyCustomer
            };
            res.render(`${area}/customerCreate`);
        });
    } else {
        res.locals = {
            title: `${area} Customer Create`,
        };
        res.render(`${area}/customerCreate`);

    }
};

module.exports.portalTallyCustomerCreate_Post = async (req, res, next) => {
    const area = 'Tally';
    // req.body.date = moment.utc(req.body.date).format("yyyy-MM-DD");
    // console.log(req.body)
    if (req.body.id && req.body.id > 0) {
        await db.tallyCustomer.update(req.body, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            res.redirect(`/portal-${area.toLowerCase()}-customer-list`);
        }).catch(function (err) {
            res.locals = {
                title: `${area} Create`,
                sales: req.body
            };
            res.render(`${area}/customerCreate`);
        });
    } else {
        await db.tallyCustomer.create(req.body)
            .then((result) => {
                if (result) {
                    // res.redirect(`/portal-${area}-list`);
                    res.redirect(`/portal-${area.toLowerCase()}-customer-create`);
                } else {
                    res.redirect(`/portal-${area.toLowerCase()}-customer-create`);
                }
            });
    }
};

module.exports.portalTallyCustomerDelete_Get = async (req, res, next) => {
    const area = 'Tally';
    if (req.params.id && req.params.id > 0) {
        await db.tallyCustomer.destroy({
            where: {
                id: req.params.id
            },
        }).then(() => {
            res.redirect(`/portal-${area}-customer-list`);
        });
    }
};

module.exports.portalTallyList = async (req, res, next) => {
    
    getTallyCustomerDropDown().then(tallyCustomerDD => {
        const area = 'Tally';
        res.locals = {
            title: `${area} List`,
            tallyCustomerDD: tallyCustomerDD
        };
        res.render(`${area}/index`);
    })
};

module.exports.getPortalTallyListData = async (req, res, next) => {
    await db.tally.findAll({
        where: {
            [Op.and]: [{
                    date: {
                        [Op.between]: [new Date(req.params.fromDate), new Date(new Date(req.params.toDate).getTime() + 60 * 60 * 24 * 1000 - 1)]
                    },
                    tallyCustomerId: {
                        [Op.eq]: req.params.tallyCustomerId
                    }
                }
            ],
        },
        include: [{
            model: db.tallyCustomer,
            attributes: ['fullName','contactNo']
        }],
        attributes: {
            exclude: ['isActive', 'createdAt', 'updatedAt']
        },
        order: [
            ['date', 'ASC']
        ],
        raw: true
    }).then(data => {
        if (data) {
            var count = 1;
            data.forEach(detail => {
                detail.sl = count++;
                detail.date = moment.utc(detail.date).format("DD-MM-yyyy");
                detail.totalExpense = detail.shopRent + detail.accountantFee + detail.bankFee + detail.gst + detail.electricityBill+ detail.mobileBill+ detail.truckBill+ detail.insuranceFee+ detail.others;
            });
            res.status(200).send(data);
        } else {
            res.status(200).send();
        }
    });
};

module.exports.portalTallyCreate_Get = async (req, res, next) => {
    const area = 'Tally';
    if (req.params.id && req.params.id > 0) {
        await db.tally.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        }).then(tally => {
            tally.date = moment.utc(tally.date).format("MM/DD/yyyy");
            res.locals = {
                title: `${area} Create`,
                tally: tally
            };
            res.render(`${area}/update`);
        });
    } else {
        getTallyCustomerDropDown().then(tallyCustomerDD => {
            res.locals = {
                title: `${area} Create`,
                tallyCustomerDD: tallyCustomerDD
            };
            res.render(`${area}/create`);
        })

    }
};

module.exports.portalTallyCreate_Post = async (req, res, next) => {
    const area = 'Tally';
    req.body.date = moment.utc(req.body.date).format("yyyy-MM-DD");
    if (req.body.id && req.body.id > 0) {
        await db.tally.update(req.body, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            res.redirect(`/portal-${area.toLowerCase()}-list`);
        }).catch(function (err) {
            res.locals = {
                title: `${area} Create`,
                sales: req.body
            };
            res.render(`${area}/create`);
        });
    } else {
        var response = true;
        req.body['group-a'].forEach(async element => {
            req.body.itemName=element.itemName;
            req.body.quantity=element.itemQuantity;
            req.body.unitPrice=element.itemPrice;
            req.body.totalPrice=element.itemTotal;
            await db.tally.create(req.body)
                .then((result) => {
                    if(!result){
                        response=false;
                    }
                }
            );
        });
        if (response) {
            // res.redirect(`/portal-${area}-list`);
            req.session.notification=[enumm.notification.Success,'Tallies Created successfully !'];
            res.redirect(`/portal-${area.toLowerCase()}-create`);
        } else {
            req.session.notification=[enumm.notification.Error,'Tallies Creation failed !'];
            res.redirect(`/portal-${area.toLowerCase()}-create`);
        }
    }
};

module.exports.portalTallyDelete_Get = async (req, res, next) => {
    const area = 'Expense';
    if (req.params.id && req.params.id > 0) {
        await db.tally.destroy({
            where: {
                id: req.params.id
            },
        }).then(() => {
            res.redirect(`/portal-${area}-list`);
        });
    }
};


module.exports.portalTallyInvoiceCreate = async (req, res, next) => {
    await db.tally.findAll({
        where: {
            [Op.and]: [{
                    date: {
                        [Op.between]: [new Date(req.params.fromDate), new Date(new Date(req.params.toDate).getTime() + 60 * 60 * 24 * 1000 - 1)]
                    },
                    tallyCustomerId: {
                        [Op.eq]: req.params.tallyCustomerId
                    }
                }
            ],
        },
        include: [{
            model: db.tallyCustomer,
            attributes: ['fullName','contactNo']
        }],
        attributes: {
            exclude: ['isActive', 'createdAt', 'updatedAt']
        },
        order: [
            ['date', 'ASC']
        ],
        raw: true
    }).then(async data => {
        if (data) {
            var count = 1;
            await db.tallyCustomer.findOne({
                where: {
                    id: req.params.tallyCustomerId
                },
                raw: true
            }).then(tallyCustomer => {
                req.body.invoiceNo=Date.now() % 100000000;
                //--------------------------------
                req.body.invoiceTo_Name=tallyCustomer.fullName;
                req.body.invoiceTo_Address=tallyCustomer.address;
                req.body.invoiceTo_Phone=tallyCustomer.contactNo;
                req.body.invoiceTo_Email=tallyCustomer.email;
                //--------------------------------
                req.body.payTo_Name="Chicken Man";
                req.body.payTo_Address="Australia";
                req.body.payTo_Phone="########";
                req.body.payTo_Email="info@chickenman.net.au";

                req.body.invoiceDate =moment.utc(new Date()).format("DD-MM-yyyy");
                var totalAmount =0;
                req.body['group-a']=data;
                req.body['group-a'].forEach(element => {
                    element.sl=count++;
                    element.date=moment.utc(element.date).format("DD-MM-yyyy");
                    totalAmount+=Number(element.totalPrice);
                    element.itemDescription="";
                    element.itemQuantity=element.quantity;
                    element.itemPrice=element.price;
                    element.itemTotal=element.totalPrice
                });
                req.body.totalAmount=totalAmount;
                req.body.taxAmount= Number(0);
                req.body.discountAmount= Number(0);
                req.body.finalAmount=totalAmount+req.body.taxAmount-req.body.discountAmount;
                res.locals = {
                    title: `Custom Invoice Making`,
                    invoice: req.body
                };
                res.render('Invoice/invoice', {
                    layout: false
                });
            });
        } else {
            res.status(200).send();
        }
    });

};
//--------------Tally End-------------


function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    // return num + " minutes = " + rhours + " hour(s) and " + rminutes + " minute(s).";
    return rhours>0?rhours + " hour(s) and " + rminutes + " minute(s).": rminutes + " minute(s).";
}

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
};

//--------------Face Verification Start-------------
module.exports.portalEmployeeFaceVerification_Get = async (req, res, next) => {
    await db.detailsInfo.update({
        faceRegistration: 1
    }, {
        where: {
            employeeCode: req.params.employeeCode
        }
    }).then(() => {
        res.status(200).json({
            status: 200,
            message: 'DetailsInfo successfully Updated !',
            url: '/portal-employee-list'
        });
    }).catch(function (err) {
        res.status(200).json({
            status: 200,
            message: 'DetailsInfo Update failed !',
            url: '/portal-employee-list'
        });
    });
};
//--------------Face Verification End-------------

//--------------Software Start-------------

module.exports.portalDocumentationFileDownload = async (req, res, next) => {
    const mainPath = path.join(__dirname, '..', '..', 'public', 'Software', 'Installation Guide.pdf');
    if (fs.existsSync(mainPath)) {
        res.download(mainPath)
    } else {
        res.redirect('/login')
    }
};

module.exports.portalSoftwareFileDownload = async (req, res, next) => {
    const mainPath = path.join(__dirname, '..', '..', 'public', 'Software', 'Face_Recognition.zip');
    if (fs.existsSync(mainPath)) {
        res.download(mainPath)
    } else {
        res.redirect('/login')
    }
};

//--------------Software End-------------
module.exports.portalCustomInvoiceCreate_Get = async (req, res, next) => {
    res.locals = {
        title: `Custom Invoice Making`
    };
    res.render('Invoice/create');
};

module.exports.portalCustomInvoiceCreate_Post = async (req, res, next) => {
    req.body.invoiceDate =moment.utc(req.body.invoiceDate).format("DD-MM-yyyy");
    // console.log(req.body['group-a'].length)
    // console.log(req.body);
    var totalAmount =0;
    req.body['group-a'].forEach(element => {
        totalAmount+=Number(element.itemTotal);
    });
    req.body.totalAmount=totalAmount;
    req.body.taxAmount= Number(typeof req.body.taxAmount!='undefined' ? req.body.taxAmount : 0);
    req.body.discountAmount= Number(typeof req.body.discountAmount!='undefined' ? req.body.discountAmount : 0);
    req.body.finalAmount=totalAmount+req.body.taxAmount-req.body.discountAmount;
    res.locals = {
        title: `Custom Invoice Making`,
        invoice: req.body
    };
    res.render('Invoice/invoice', {
        layout: false
    });
};