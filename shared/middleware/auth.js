const jwt = require('jsonwebtoken');
const User = require('../../db/schema/User');
const tokenHandler = async (req, res, next) => {
    let token;

    const authHeader = req.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.slice(7, authHeader.length);
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token)
        return res.status(401).json({ error: 'You are unauthorize to use this route', data: {} });

    try {
        const decode = await jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decode.user_id);
        next();
    } catch (e) {
        res.status(401).json({ error: 'token is not valid', data: {} });
    }
};

module.exports = tokenHandler;