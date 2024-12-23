const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config()
const globleVars = require('../globalVars.js')
async function connect(){
    const client = new MongoClient(process.env.CONNECTION_STRING,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );
    await client.connect()
    
    const database = client.db("CommServiceData");
    const channelConnection = database.collection("Channels");
    const userConnection = database.collection("Users");
    const studentFormsConnection = database.collection("StudentForms")

    globleVars.database.setVal(database);
    globleVars.userConnection.setVal(userConnection);
    globleVars.channelConnection.setVal(channelConnection);
    globleVars.studentFormConnection.setVal(studentFormsConnection);
    console.log("Set value for channel :" + JSON.stringify(channelConnection))
    console.log("Set value for student form: " + JSON.stringify(studentFormsConnection))
}
connect().then((arr)=>{
    console.log("Connected to MongoDB!")
})
