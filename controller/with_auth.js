const router = require('express').Router();
const TodoModel = require('../schema/todo');
const todoModel = require('../schema/todo');

router.post('/todos', async (req, res, next) => {
    const { title } = req.body;

    //* Create todo
    const todo = await todoModel.create({ title });
    res.status(201).json({ success: true, data: todo });
});

router.put('/todos/:id', async (req, res, next) => {
    const { title } = req.body;

    //* Dont have title === dont change todo
    if (!title) {
        const todo = await todoModel.findById(req.params.id).orFail();
        res.status(200).json({ success: true, data: todo });
    }

    //* Have title === change todo
    else {
        const todo = await todoModel.findByIdAndUpdate(req.params.id, { $set: { title } }, { new: true }).orFail();
        res.status(200).json({ success: true, data: todo });
    }
});

router.delete('/todos/:id', async (req, res) => {
    await TodoModel.findByIdAndRemove(req.params.id).orFail();
    res.status(200).json({ success: true, data: {} });
});

module.exports = router;