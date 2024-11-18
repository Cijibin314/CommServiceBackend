const mongoose = require('mongoose')
const { Schema, model } = mongoose;
const {Model} = require("Model.js")

const fields = {
  username: String,
  password: String,
  hours: Number,
  activity: Object
}
const collection = ""
let usersModel = new Model(collectionName, fields)
module.exports = {usersModel};