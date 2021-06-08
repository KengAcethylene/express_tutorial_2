const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");

const DB_NAME = process.env.MONGO_DB_NAME + "_test";

//middleware
class ModelGenerator {
    constructor() {
        if (!mongoose.connection) throw new Error("Mongoose change API?");

        const c = mongoose.connection;
        if (!c.client || !c.client.db || !c.useDb)
            throw new Error("Mongoose change API?");

        this.connection = c.useDb(DB_NAME);
        this.createdModels = [];
    }

    async generate(oldModel, data) {
        if (!oldModel.modelName || !oldModel.schema)
            throw new Error("Mongoose change API?");

        const newName = uuid().replace(/-/g, "") + oldModel.modelName;
        const newSchema = Object.assign(
            Object.create(Object.getPrototypeOf(oldModel.schema)),
            oldModel.schema
        );
        newSchema.options = Object.assign({}, newSchema.options, {
            collection: newName
        });

        const model = this.connection.model(newName, newSchema);
        await model.ensureIndexes();
        if (data) await model.insertMany(data);
        this.createdModels.push(newName);
        return model;
    }

    async cleanUp() {
        await Promise.allSettled(
            this.createdModels.map(a => this.connection.dropCollection(a))
        );
    }
}

module.exports = ModelGenerator;