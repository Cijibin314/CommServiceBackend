const mongoose = require('mongoose')
const { Schema, model } = mongoose;
const {Model} = require("./Model.js")

const fields = {
  followId: String,
  channel: String
}
const collectionName = "Channels"
let ChannelModel = new Model(collectionName, fields).makeModel()
module.exports = {ChannelModel};