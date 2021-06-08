const Todo = require('../../db/schema/todo');
const User = require('../../db/schema/user');

const dbMiddleware = (req, res, next) => {
    req.db = { User: User, Todo: Todo };
    next();
};

module.exports = dbMiddleware;