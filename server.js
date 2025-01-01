//Note: If having problems with global vars not loading in time, make suer that the editor is fully loaded
const express = require('express');
const globalVars = require('./globalVars')
const cors = require('cors');
//Files
console.log("Loading MongoDB Files")
require('./mongoDB/mongoDBLoader')
console.log("Loading Google Files");
require('./google/googleLoader')
const {makeDocumentFromDb, addStudentDataToDb, addParentDataToDb, addSupervisorDataToDb, verifyBy, getDocDataFromDb} = require('./mongoDB/docData')
const {sendEmailToSchool, sendEmailToParent, sendEmailToSupervisor, sendSuccessEmailToStudent} = require('./google/sendEmail')
const {addPermActivity} = require('./mongoDB/activity')
const {generateShareableLink} = require('./google/getLinks')
const {handleInvalidForm, validGoogleAccount} = require('./helper')
//Working on a test to see if emails are valid besides for just trying to send to them
//Setup
require("dotenv").config();
const app = express();
// Middleware
async function checkForRequirements(req, res, next) {
  if(globalVars.database){
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

app.put('/api/studentFormSubmitted', async (req,res)=>{
  const payload = req.body;
  console.log('Received form submission(student):', payload);
  addStudentDataToDb(payload);

  const validSupAccount = await validGoogleAccount(payload.SupervisorEmail)
  const validParAccount = await validGoogleAccount(payload.ParentEmail)
  if(validSupAccount && validParAccount){
    console.log("Both emails valid")
    sendEmailToSupervisor(payload);
    sendEmailToParent(payload);    
  }
  else if(!validSupAccount){
    console.log("Sup email invalid")
    handleInvalidForm(payload.Email, 1)
  }
  else{
    console.log("Par email invalid")
    handleInvalidForm(payload.Email, 0)
  }
  
  res.status(200).json({
    message: 'Form submitted successfullyyyy!',
    receivedData: payload
  });
})
app.put('/api/invalidStudentFormSubmitted', async (req,res)=>{
  const payload = req.body;
  console.log('Received invalid form submission(student):', payload);
  console.log("Type: " + typeof payload)
  handleInvalidForm(payload.Email, 2)
  res.status(200).json({
    message: 'Sending redo email',
    receivedData: payload
  });
})
app.put('/api/supervisorFormSubmitted', async (req,res)=>{
  const payload = req.body;
  console.log('Received form submission(supervisor):', payload);
  const dateSubmitted = payload["Datestudentfilledouttheirform"]
  const docData = await getDocDataFromDb(dateSubmitted);
  await verifyBy(dateSubmitted, "Supervisor");
  await addSupervisorDataToDb(dateSubmitted, payload);
  if(docData.verifiedByParent && !docData.formCreated){
    console.log("creating form-s")
     const docId = await makeDocumentFromDb(dateSubmitted)
     const link = await generateShareableLink(docId);
     sendEmailToSchool(link, docData.studentData.Email)
  }else{
    console.log("not yet-s")
  }
  res.status(200).json({
    message: 'Form submitted successfullyyyy!',
    receivedData: payload
  });
})
app.put('/api/parentFormSubmitted', async (req,res)=>{
  const payload = req.body;
  console.log('Received form submission(parent):', payload);
  const dateSubmitted = payload["Datestudentfilledouttheirform"]
  await verifyBy(dateSubmitted, "Parent");
  await addParentDataToDb(dateSubmitted, payload);
  const docData = await getDocDataFromDb(dateSubmitted);
  console.log("docData: ", docData)
  console.log("verifiedBySupervisor: ", typeof docData.verifiedBySupervisor)
  if(docData.verifiedBySupervisor && !docData.formCreated){
    console.log("creating form-p")
     const docId = await makeDocumentFromDb(dateSubmitted);
     const link = await generateShareableLink(docId);
     sendEmailToSchool(link, docData.studentData.Email)
  }else{
    console.log("not yet-p")
  }
  res.status(200).json({
    message: 'Form submitted successfullyyyy!',
    receivedData: payload
  });
})

app.put('/api/schoolFormSubmitted', async (req,res)=>{
  const payload = req.body;
  console.log('Received form submission(school):', payload);
  const dateSubmitted = payload["Datestudentfilledouttheirform"]
  if(payload["Validatethestudent'sform"] === "Valid form"){
    const docData = await getDocDataFromDb(dateSubmitted);
    await verifyBy(dateSubmitted, "School");
    addPermActivity(docData)
    sendSuccessEmailToStudent(docData.studentData.Email, docData.dateSubmitted)
  }else{
    console.log("Invalid form")
    handleInvalidForm(payload.Email, 3)
  }
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