const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config()
const globleVars = require('../globalVars')
let database, channelConnection, userConnection;
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
    database = client.db("CommServiceData");
    channelConnection = database.collection("Channels");
    userConnection = database.collection("Users");
    return [client, channelConnection, userConnection]
}
connect().then((arr)=>{
    console.log("Connected to MongoDB!")
    globleVars.database = arr[0];
    globleVars.userConnection = arr[1];
    globleVars.channelConnection = arr[2];})
