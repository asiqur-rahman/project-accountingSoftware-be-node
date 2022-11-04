const joi = require('@hapi/joi');

const schema = {
    create:joi.object({
        bankAccountId:joi.number().required(),
        number:joi.string().required(),
        amount:joi.number().required(),
        dateTime:joi.string(),
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
