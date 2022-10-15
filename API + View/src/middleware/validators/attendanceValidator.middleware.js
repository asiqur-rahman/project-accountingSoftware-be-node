const joi = require('@hapi/joi');

const schema = {
    attendanceCreate:joi.object({
        month:joi.number().max(12).required(),
        year:joi.number().min(1000).max(9999).required()
    })
}

module.exports.attendanceCreateValidator = async (req,res,next)=>{
    const value=await schema.attendanceCreate.validate(req.body);
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