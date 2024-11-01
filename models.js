const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  hours: Number,
  activity: Object
});
  
function createModel(collectionName){
  return model('UserData', userSchema, collectionName)
}
usersModel = createModel("users");
module.exports = {usersModel};