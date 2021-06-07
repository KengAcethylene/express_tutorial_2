const {ValidationError,DocumentNotFoundError}= require('mongoose').Error;

const errorHandler = (err,req,res,next)=>{
    if (err instanceof ValidationError){
        res.status(400).json({error:err.message})
    }

    else if (err instanceof DocumentNotFoundError){
        res.status(400).json({error:err.message})
    }

}

module.exports = errorHandler