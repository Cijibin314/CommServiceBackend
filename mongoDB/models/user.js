const mongoose = require('mongoose')
const { Schema, model } = mongoose;
const {Model} = require("Model.js")

const fields = {
  username: String,
  password: String,
  hours: Number,
  activity: Object
}
const collectionName = "Users"
let CsersModel = new Model(collectionName, fields).makeModel()
module.exports = {CsersModel};