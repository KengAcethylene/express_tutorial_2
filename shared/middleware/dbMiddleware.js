const glob = require('glob');
const path = require('path');

const db = {};
const files = glob.sync(path.join(__dirname, '../../db/schema/*.js'));
for (var file of files) db[path.basename(file, '.js')] = require(file);

const dbMiddleware = (req, res, next) => {
    req.db = db;
    next();
};
module.exports = dbMiddleware;

module.exports.db = db;