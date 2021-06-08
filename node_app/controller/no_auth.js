const router = require('express').Router();

router.get("/todos", async (req, res) => {

    const response = await req.db.Todo.find().orFail();
    res.json({ success: true, count: response.length, data: response });

});

router.get("/todos/:id", async (req, res) => {

    const response = await req.db.Todo.findById(req.params.id).orFail();
    res.json({ success: true, data: response });

});

router.put('/todos/:id', async (req, res) => {
    const { title } = req.body;

    //* Dont have title === dont change todo
    if (!title) {
        const todo = await req.db.Todo.findById(req.params.id).orFail();
        res.status(200).json({ success: true, data: todo });
    }

    //* Have title === change todo
    else {
        const todo = await req.db.Todo.findByIdAndUpdate(req.params.id, { $set: { title } }, { new: true }).orFail();
        res.status(200).json({ success: true, data: todo });
    }
});

router.post("/todos", async (req, res) => {
    const { title } = req.body;

    //* Create todo
    const todo = await req.db.Todo.create({ title });
    res.status(201).json({ success: true, data: todo });
});

router.delete("/todos/:id", async (req, res, next) => {

    await req.db.Todo.findByIdAndRemove(req.params.id).orFail();
    res.status(200).json({ success: true, data: {} });
});

module.exports = router;