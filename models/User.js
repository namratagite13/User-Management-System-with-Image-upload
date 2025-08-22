const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique:true,
        trim:true
    },
    email:{
        type: String,
        require: true,
        trim:true,
        lowercase: true
    },
    password:{
        type: String,
        //validate value of password to one of this two string
        required: true
    },
    role:{
        type: String,
        enum:['user', 'admin'],
        default: 'user'
    }


} , {timestamps:true})

module.exports = mongoose.model('User', UserSchema)