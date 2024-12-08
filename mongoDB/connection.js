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

    globleVars.database.setVal(database);
    globleVars.userConnection.setVal(userConnection);
    globleVars.channelConnection.setVal(channelConnection);
}
connect().then((arr)=>{
    console.log("Connected to MongoDB!")
})
