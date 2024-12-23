const express = require('express');
const globalVars = require('./globalVars')
const cors = require('cors');
//Files
console.log("Loading MongoDB Files")
require('./mongoDB/mongoDBLoader')
console.log("Loading Google Files");
require('./google/googleLoader')
const {getChannelName} = require('./mongoDB/channels')
const {insertStudentDataFromDb} = require('./mongoDB/studentForms')
const {handleDrawingUpdate} = require('./google/channels')
const {insertSupervisorData, insertStudentData} = require('./google/docs')
//Setup
require("dotenv").config();
const app = express();

// Middleware
async function checkForRequirements(req, res, next) {
  if(globalVars.userConnection && globalVars.channelConnection && globalVars.database){
    next();
  }else{
    console.log("Not connected to mongodb")
    res.status(460).json({message: 'User not connected'})
  }
  
}
app.use(express.json());
app.use(cors());
app.use(checkForRequirements)

//handle conection. Simply testing purposes
//Set up endpoints
app.get('/api/getUser/:username',(req,res)=>{
    const username = req.params.username
    res.status(200).send(username)
})

app.get('/api/receiveDrawingUpdate/:channelName', (req, res)=>{
  console.log("Drawing just changed from channel: " + req.params.channelName)
})
app.post('/api/receiveDrawingUpdate/:channelName', async (req, res)=>{
  const channelId = req.header("X-Goog-Channel-Id");
  const channelName = await getChannelName(channelId)
  console.log("Update Received")
  if(channelName){
    //console.log("_______")
    console.log(`Notification received for Channel: ${channelName}`);
    const resourceState = req.header("X-Goog-Resource-State");
    // **Handle Different Notification Types**
    switch(resourceState){
      case "change":
        console.log("File content or metadata was changed.")
        break;
      case "update":
        console.log("File content was updated.")
        handleDrawingUpdate(channelName)
        break;
      case "sync":
        console.log("Can be ignored")
        break;
      default:
        console.log("Unhandled notification type:", resourceState)
    }
    // Respond with HTTP 200 to acknowledge receipt
    res.sendStatus(200);
  }
  else{
    res.sendStatus(202)
  }
})


app.post('/api/addActivityForm', (req,res)=>{
    const username = req.body["userame"]
    const activity = req.body["activity"]

})
app.post('/api/addActivityPdf', (req,res)=>{

})
app.post('/api/addUser', (req,res)=>{

})
app.put('/api/supervisorFormSubmitted', (req,res)=>{
  // const payload = req.body;
  // console.log('Received form submission(supervisor):', payload);
  // const docId = "1qA7EVNkqVXTPTlyI9lNoWbDcfoRe8N1_nL_PkCtCOss"
  // insertSupervisorData(docId, payload);
  // insertStudentDataFromDb(docId);
  // res.status(200).json({
  //   message: 'Form submitted successfullyyyy!',
  //   receivedData: payload
  // });
})
app.put('/api/studentFormSubmitted', (req,res)=>{
  // const payload = req.body;
  // console.log('Received form submission(student):', payload);
  // const docId = "1qA7EVNkqVXTPTlyI9lNoWbDcfoRe8N1_nL_PkCtCOss"
  // insertStudentData(docId, payload);
  // res.status(200).json({
  //   message: 'Form submitted successfullyyyy!',
  //   receivedData: payload
  // });
})
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
console.log("End of server.js file :)")
