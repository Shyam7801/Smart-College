const { now } = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName : String,
    password : {
        type: String,
        required : true
    },
    enroll_number:{
        type: String,
        required : true
    },
    first_name : {
        type: String,
        required : true
    },
    last_name : {
        type: String,
        required : true
    },
    email : {
        type: String,
        required : true
    }
}, { timestamps: true });

const User = mongoose.model('User',userSchema);
module.exports = User;