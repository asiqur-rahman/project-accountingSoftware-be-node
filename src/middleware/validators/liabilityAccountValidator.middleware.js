const joi = require('@hapi/joi');

const schema = {
    accountCreate:joi.object({
        firstName:joi.string().max(100).required(),
        lastName:joi.string().max(100).required(),
        email:joi.string().email({ tlds: { allow: true }}).required(),
        contactNo:joi.string().max(15).required(),
        address:joi.string().max(100).required(),
        username:joi.string().max(50).required(),
        password:joi.string().max(50).required(),
        isActive:joi.number().required(),
        branchId:joi.number().required(),
        roleId:joi.number().required()
    }),
}

module.exports.accountCreateValidator = async (req,res,next)=>{
    const value=await schema.accountCreate.validate(req.body);
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
