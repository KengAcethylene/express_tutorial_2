const router = require('express').Router();
const bcrypt = require('bcrypt');
const authHandler = require('../../shared/middleware/auth');

router.post("/register", async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        //* have all component in body
        if (!name || !email || !password) return res.status(400).json({ error: "Please add [name] [email] [password] in body", data: {} });

        //* Check exist user
        const checkEmail = await req.db.User.findOne({ email }).select('_id');
        if (checkEmail) return res.status(400).json({ error: "email is already used.", data: {} });

        //* Create User
        const user = await req.db.User.create({ name, email, password: await bcrypt.hash(password, parseInt(process.env.SALT)) });
        if (!user) return res.status(400).json({ error: 'cannot create user', data: {} });

        const token = user.getSignedJwtToken();
        if (!token) return res.status(400).json({ error: "cannot generate token", data: {} });

        res.status(200).cookie('token', token).json({ success: true, token });
    } catch (err) {
        next(err, req, res);
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    //* have all component in body
    if (!email || !password) return res.status(400).json({ error: "Please add [email] [password] in body", data: {} });

    //* Check user existed
    const user = await req.db.User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ error: 'invalid email or password', data: {} });

    //* Check password match
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) return res.status(401).json({ error: 'invalid email or password', data: {} });

    const token = user.getSignedJwtToken();
    if (!token) return res.status(400).json({ error: "cannot generate token", data: {} });

    res.status(200).cookie('token', token).json({ success: true, token });
});

router.post("/logout", authHandler, async (req, res) => {
    const user = req.user;

    if (!user) return res.status(401).json({ error: 'invalid user', data: {} });

    res.status(200).clearCookie('token').json({ success: true, data: user });
});

module.exports = router;