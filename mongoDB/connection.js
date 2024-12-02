const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config()
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
module.exports = {channelConnection, userConnection}