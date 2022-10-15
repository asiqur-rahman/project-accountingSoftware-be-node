const joi = require('@hapi/joi');

const schema = {
    routine:joi.object({
        month:joi.number().max(12).required(),
        year:joi.number().min(1000).max(9999).required(),
        routine:joi.string().max(1000).required()
    }),
    routineCreate:joi.object({
        month:joi.number().max(12).required(),
        year:joi.number().min(1000).max(9999).required()
    }),
    justRoutineUpdate:joi.object({
        routine:joi.string().max(1000).required()
    })
}

module.exports.routineValidator = async (req,res,next)=>{
    req.body.routine=JSON.stringify(req.body.routine);
    const value=await schema.routine.validate(req.body);
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

module.exports.routineCreateValidator = async (req,res,next)=>{
    const value=await schema.routineCreate.validate(req.body);
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

module.exports.justRoutineUpdateValidator = async (req,res,next)=>{
    req.body.routine=JSON.stringify(req.body.routine);
    const value=await schema.justRoutineUpdate.validate(req.body);
    if(value.error){
        res.json({
            status:0,
            message: value.error.details[0].message
        })
    }
    else{
        next();
    }

    // Book.update(
    //     {title: req.body.title},
    //     {returning: true, where: {id: req.params.bookId} }
    //   )
    //   .then(function([ rowsUpdate, [updatedBook] ]) {
    //     res.json(updatedBook)
    //   })
    //   .catch(next)
    //  })
};