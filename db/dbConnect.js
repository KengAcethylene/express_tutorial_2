const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });
    } catch (err) {
        throw new Error(err);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = { connectDB, disconnectDB };