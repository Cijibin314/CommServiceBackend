const mongoose = require('mongoose')
const { Schema, model } = mongoose;

class Model{
    constructor(collectionName, fields){
        this.collectionName = collectionName;
        this.fields = fields
    }
    makeModel(){
        const schema = new Schema(fields, { collection: this.collectionName});
        newModel = createModel(this.collectionName, schema);
        return newModel
    }
}
module.exports = {Model}