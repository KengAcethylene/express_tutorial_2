require('../config_env');
require('express-async-errors');

const mongoose = require('mongoose');
const { ValidationError, CastError } = mongoose.Error;
const ModelGenerator = require('./modelGenerator');
const initDbData = require('../mocks/init_db_data');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorHandler = require('../middlewares/error_handler');
const _ = require('lodash');
const { connectDB, disconnectDB } = require('../../db/connect');

module.exports = (controller) =>
    express()
        .use(bodyParser.json())
        .use(bodyParser.urlencoded({ extended: true }))
        .use(cookieParser())
        .use(mockDBMiddleware())
        .use(controller)
        .use(errorHandler);

// setup mockDB to mock data that will be used to test
let mockDb = {};
let modelGenerator;

module.exports.mockDb = (collection, data) => {
    if (!data) mockDb[collection] = [];
    else if (Array.isArray(data)) mockDb[collection] = data;
    else mockDb[collection] = [data];
};

const mockDBMiddleware = () => {
    return async (req, res, next) => {
        req.db = await prepareDb(req.db);
        next();
    };
};

const prepareDb = async (db) => {
    for (var x in mockDb) {
        if (!db[x]) throw new Error('incorrect mockDb name');
        try {
            mockDb[x] = await modelGenerator.generate(db[x], mockDb[x]);
        } catch (e) {
            if (!(e instanceof ValidationError) && !(e instanceof CastError)) throw e;
            var prototype = initDbData[x][0];
            var dataArray = mockDb[x];
            console.log('DEGUBGGG', dataArray);
            var transformedData = [];

            if (!prototype) throw new Error('Model ' + x + ' requires init_db_data');
            for (var i = 0, ii = dataArray.length; i < ii; i++)
                transformedData.push(Object.assign({}, prototype, dataArray[i]));
            try {
                mockDb[x] = await modelGenerator.generate(db[x], transformedData);
            } catch (e) {
                if (e instanceof ValidationError || e instanceof CastError) throw e;
            }
        }
    }
    var ans = _.assign({}, db, mockDb);
    mockDb = {};
    return ans;
};

beforeAll(async () => {
    await connectDB();
    modelGenerator = new ModelGenerator();
});

afterAll(async () => {
    await disconnectDB();
});