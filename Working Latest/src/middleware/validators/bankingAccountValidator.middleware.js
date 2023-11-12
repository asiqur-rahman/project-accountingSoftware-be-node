const joi = require('@hapi/joi');

const schema = {
    create:joi.object({
        accountTitle:joi.string().max(100).required(),
        name:joi.string().required(),
        accountNumber:joi.string().required(),
        description:joi.string()
    }),
}

module.exports.createValidator = async (req,res,next)=>{
    const value=await schema.create.validate(req.body);
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
