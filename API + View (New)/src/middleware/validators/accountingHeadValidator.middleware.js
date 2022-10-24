const joi = require('@hapi/joi');

const schema = {
    accountCreate:joi.object({
        name:joi.string().max(100).required(),
        amount:joi.number().required(),
        isActive:joi.number().required(),
        currencyId:joi.number().required(),
        parentId:joi.number().required()
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
