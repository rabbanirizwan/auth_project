const { func } = require('@hapi/joi');
const mongoose = require('mongoose');
const Schema  = mongoose.Schema
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    email:{
        type: String,
        require: true,
        lowercase: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    }
})

UserSchema.pre('save',async function (next){
   try{
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password,salt);
    this.password = hashPassword;
    next();
   }catch(error){
       next(error);
   }
})

UserSchema.methods.isValidPassword = async function(password){
    console.log("this password",this.password)
    try {
       return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

const User= mongoose.model('user',UserSchema);

module.exports = User