const mongoose = require('mongoose')
const { Schema, model } = mongoose;

class Model{
    constructor(collectionName, fields){
        this.collectionName = collectionName;
        this.fields = fields
    }
    makeModel(){
        const schema = new Schema(this.fields, { collection: this.collectionName});
        let newModel = model(this.collectionName, schema);
        return newModel
    }
}
module.exports = {Model}