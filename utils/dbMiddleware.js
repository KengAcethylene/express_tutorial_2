const Todo = require('../schema/todo');
const User = require('../schema/user');

module.exports = (req, res, next) => {
    req.db = { User: User, Todo: Todo };
    next();
};