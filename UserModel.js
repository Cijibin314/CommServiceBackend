const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  activity: Object
});
  
module.exports = model('UserData', userSchema)