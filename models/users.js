const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name:{
            type: 'string',
            required: true
        },
        email:{
            type: 'string',
            required: true
        },
        mobile:{
            type: 'string',
            required: true
        }
    }
);

module.exports = mongoose.model('users', userSchema);