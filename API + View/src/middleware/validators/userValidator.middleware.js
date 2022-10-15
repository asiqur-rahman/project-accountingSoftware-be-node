const joi = require('@hapi/joi');

const schema = {
    user:joi.object({
        username:joi.string().max(100).required(),
        email:joi.string().email({ tlds: { allow: true }}).required(),
        password:joi.string().max(100).required(),
        status:joi.number().max(1).required()
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