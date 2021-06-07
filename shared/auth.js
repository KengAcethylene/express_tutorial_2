const jwt = require('jsonwebtoken');
const userModel = require('../schema/user');
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['cookie'];
        const token = authHeader && authHeader.split('=')[1];
        if (token == null) return res.status(401).json({ error: "You are unauthorize to use this route", data: {} });

        const _id = await jwt.verify(token, process.env.JWT_SECRET).user_id;
        const user = await userModel.findOne({ _id });
        req.user = user;

        next();
    } catch (err) {
        return res.status(401).json({ error: 'token is expired', data: {} });
    }
};

module.exports = authenticateToken;