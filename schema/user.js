const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const userSchema = mongoose.Schema({
    name: { type: String, required: [true, 'Please add a name'] },
    email: {
        type: String,
        validate: {
            validator: (val) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),
            message: (props) => `${props.value} validation error`,
        },
    },

    password: {
        type: String,
        required: [true, 'Please add a password'],
        select: false,
    },
    createdAt: { type: Date, default: new Date() }
}, { collection: "user" });

userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ user_id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;