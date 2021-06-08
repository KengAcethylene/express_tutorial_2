const { ValidationError, DocumentNotFoundError, CastError } = require('mongoose').Error;

const errorHandler = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, data: {} });
    }

    else if (err instanceof DocumentNotFoundError) {
        return res.status(400).json({ error: `Todo not found with id ${err.query._id}`, data: {} });
    }

    else if (err instanceof CastError) {
        return res.status(400).json({ error: err.message, data: {} });
    }
    else {
        next(err, req, res);
    }
};

module.exports = errorHandler;