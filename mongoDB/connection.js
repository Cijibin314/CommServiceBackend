const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config()
const globleVars = require('../globalVars.js')
function connect(){
    const client = new MongoClient(process.env.CONNECTION_STRING,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );
    client.connect().then(()=>{
        const database = client.db("CommServiceData");
        const userConnection = database.collection("Users");
        const docDataConnection = database.collection("DocData")

        globleVars.database.setVal(database);
        globleVars.userConnection.setVal(userConnection);
        globleVars.docDataConnection.setVal(docDataConnection);
        //console.log("studFormConn: " + globleVars.studentFormConnection.getVal())
    })
}
connect()
console.log("Connected to MongoDB!")
