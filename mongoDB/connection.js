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
    const database = await client.db("CommServiceData");
    const activityConnection = await database.collection("Activity");
    const docDataConnection = await database.collection("DocData")

    await globleVars.database.setVal(database);
    await globleVars.activityConnection.setVal(activityConnection);
    await globleVars.docDataConnection.setVal(docDataConnection);
    //console.log("studFormConn: " + globleVars.studentFormConnection.getVal())

}
connect().then(()=>{
    console.log("Connected to MongoDB!")
})

