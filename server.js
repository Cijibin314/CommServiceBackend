const express = require('express');
const globalVars = require('./globalVars')
const cors = require('cors');
//Files
console.log("Loading MongoDB Files")
require('./mongoDB/mongoDBLoader')
console.log("Loading Google Files");
require('./google/googleLoader')
const {insertStudentDataFromDb, addStudentDataToDb} = require('./mongoDB/studentForms')
const {insertSupervisorData, insertStudentData} = require('./google/docs')
//Setup
require("dotenv").config();
const app = express();

// Middleware
async function checkForRequirements(req, res, next) {
  if(globalVars.userConnection && globalVars.database){
    next();
  }else{
    console.log("Not connected to mongodb")
    res.status(460).json({message: 'User not connected'})
  }
  
}
app.use(express.json());
app.use(cors());
app.use(checkForRequirements)

//handle conection
//Set up endpoints
app.put('/api/supervisorFormSubmitted', (req,res)=>{
  const payload = req.body;
  console.log('Received form submission(supervisor):', payload);
  const dateSubmitted = payload["Datestudentfilledouttheirform"]
  const docId = insertStudentDataFromDb(dateSubmitted);
  if(checkIfFormVerified(dateSubmitted)){
    insertSupervisorData(docId, payload);
  }
  res.status(200).json({
    message: 'Form submitted successfullyyyy!',
    receivedData: payload
  });
})

app.put('/api/studentFormSubmitted', (req,res)=>{
  const payload = req.body;
  console.log('Received form submission(student):', payload);
  addStudentDataToDb(payload);
  sendEmailToSupervisor(payload.SupervisorEmail, payload.VolunteerOrganization, payload.Name, payload.DateSubmitted);
  sendEmailToParent(payload.ParentEmail, payload.VolunteerOrganization, payload.Name, payload.DateSubmitted);
  res.status(200).json({
    message: 'Form submitted successfullyyyy!',
    receivedData: payload
  });
})

app.put('/api/parentFormSubmitted', (req,res)=>{
  const payload = req.body;
  console.log('Received form submission(parent):', payload);
  const dateSubmitted = payload["Datestudentfilledouttheirform"]
  
  insertSupervisorData(docId, payload);
  res.status(200).json({
    message: 'Form submitted successfullyyyy!',
    receivedData: payload
  });
})
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
console.log("End of server.js file :)")
//Transport the id throught the url params of the supervisor form when emailing
