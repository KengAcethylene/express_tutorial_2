const router = require('express').Router();

router.post('/todos', async (req, res) => {
    const { title } = req.body;

    //* Create todo
    const todo = await req.db.Todo.create({ title });
    res.status(201).json({ success: true, data: todo });
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

router.delete('/todos/:id', async (req, res) => {
    await req.db.Todo.findByIdAndRemove(req.params.id).orFail();
    res.status(200).json({ success: true, data: {} });
});

module.exports = router;