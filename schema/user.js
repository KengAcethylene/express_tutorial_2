const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user: { type: String, require: [true, 'Please add a username'] },
    email: {
        type: String, 
        validate: {
            validator: (val) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),
            message: (props) => `${props.value} validation error`,
        },
    },
    password: { trpe: String, require: [true, "Please add a password"] }
}, { collection: "user" })

const userModel = mongoose.model("user", userSchema);
module.exports = userModel