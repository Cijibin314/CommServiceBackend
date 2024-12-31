const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config()
const globleVars = require('../globalVars.js')
async function connect(){
    const client = await new MongoClient(process.env.CONNECTION_STRING,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );
    await client.connect()
    const database = client.db("CommServiceData");
    const activityConnection = database.collection("Activity");
    const docDataConnection = database.collection("DocData")

    globleVars.database.setVal(database);
    globleVars.activityConnection.setVal(activityConnection);
    globleVars.docDataConnection.setVal(docDataConnection);
    //console.log("studFormConn: " + globleVars.studentFormConnection.getVal())

}
connect().then(()=>{
    console.log("Connected to MongoDB!")
})

