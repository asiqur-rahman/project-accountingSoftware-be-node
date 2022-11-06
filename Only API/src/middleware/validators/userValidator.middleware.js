const joi = require('@hapi/joi');

const schema = {
    user:joi.object({
        Username:joi.string().max(100).required(),
        Email:joi.string().email({ tlds: { allow: true }}).required(),
        Password:joi.string().max(100).required(),
        Status:joi.number().max(1).required()
    }),
    userCreate:joi.object({
        firstName:joi.string().max(100).required(),
        lastName:joi.string().max(100).required(),
        email:joi.string().email({ tlds: { allow: true }}).required(),
        contactNo:joi.string().max(15).required(),
        address:joi.string().max(100).required(),
        username:joi.string().max(50).required(),
        isActive:joi.number().required(),
        branchId:joi.number().required(),
        roleId:joi.number().required()
    }),
    userUpdateWithPass:joi.object({
        id:joi.number().required(),
        firstName:joi.string().max(100).required(),
        lastName:joi.string().max(100).required(),
        email:joi.string().email({ tlds: { allow: true }}).required(),
        contactNo:joi.string().max(15).required(),
        address:joi.string().max(100).required(),
        username:joi.string().max(50).required(),
        password:joi.string().max(50).required(),
        isActive:joi.number().required(),
        branchId:joi.number().required(),
        userDetailId:joi.number().required(),
        roleId:joi.number().required()
    }),
    userUpdateWithoutPass:joi.object({
        id:joi.number().required(),
        firstName:joi.string().max(100).required(),
        lastName:joi.string().max(100).required(),
        email:joi.string().email({ tlds: { allow: true }}).required(),
        contactNo:joi.string().max(15).required(),
        address:joi.string().max(100).required(),
        username:joi.string().max(50).required(),
        isActive:joi.number().required(),
        branchId:joi.number().required(),
        userDetailId:joi.number().required(),
        roleId:joi.number().required()
    }),
    loginValidator:joi.object({
        username:joi.string().max(100).required(),
        password:joi.string().max(100).required()
    }),
}

module.exports.userValidator = async (req,res,next)=>{
    const value=await schema.user.validate(req.body);
    if(value.error){
        res.json({
            status:0,
            message: value.error.details[0].message
        })
    }
    else{
        next();
    }
};

module.exports.userCreateValidator = async (req,res,next)=>{
    const value= await schema.userCreate.validate(req.body);
    if(value.error){
        res.json({
            status:0,
            message: value.error.details[0].message
        })
    }
    else{
        next();
    }
};

module.exports.userUpdateWithoutPassValidator = async (req,res,next)=>{
    const value= await schema.userUpdateWithoutPass.validate(req.body);
    if(value.error){
        res.json({
            status:0,
            message: value.error.details[0].message
        })
    }
    else{
        next();
    }
};

module.exports.loginValidator = async (req,res,next)=>{
    const value=await schema.loginValidator.validate(req.body);
    if(value.error){
        res.json({
            status:0,
            message: value.error.details[0].message
        })
    }
    else{
        next();
    }
};