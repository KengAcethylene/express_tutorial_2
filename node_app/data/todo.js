const { ObjectId } = require('mongoose').Types;

exports.todo = [
    {
        _id: ObjectId('60a77ed40df917452759a018'),
        order: 1,
        createdAt: '2021-05-21T09:33:53.108Z',
        title: 'Day 1 work!',
    },
    {
        _id: ObjectId('60a7eaabf3f40f1be5064ca7'),
        order: 2,
        createdAt: '2021-05-21T17:15:12.984Z',
        title: 'Day 2 work!',
    },
];