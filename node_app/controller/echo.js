const router = require('express').Router();

router.get('/echo_get', (req, res) => {
    res.json({ message: "Hello World!!!!" });
});

router.get('/echo_qs', (req, res) => {
    const { title, page } = req.query;
    const response = {};
    if (title) {
        response.title = title;
    }
    if (page) {
        response.page = page;
    }
    res.json(response);
});

router.get('/echo_params/:params', (req, res) => {
    res.send(req.params);
});

router.post('/echo_post', (req, res) => {
    res.send(req.body);

});
module.exports = router;