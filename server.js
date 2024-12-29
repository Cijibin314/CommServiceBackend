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
const {handleInvalidForm} = require('./helper')

//TODO:       Implement the two other emails to the student: sucessfully verified, and invalid form submission
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
  try{sendEmailToSupervisor(payload);

  }catch(e){
    handleInvalidForm(payload.email, 0)
  }
  try{sendEmailToParent(payload);    
  }catch(e){
    handleInvalidForm(payload.email, 1)
  }
  
  res.status(200).json({
    message: 'Form submitted successfullyyyy!',
    receivedData: payload
  });
})
app.put('/api/invalidStudentFormSubmitted', async (req,res)=>{
  const payload = req.body;
  console.log('Received invalid form submission(student):', payload);
  handleInvalidForm(payload.email, 2)
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
  verifyBy(dateSubmitted, "Supervisor");
  await addSupervisorDataToDb(dateSubmitted, payload);
  if(docData.verifiedByParent && !docData.formCreated){
    console.log("creating form-s")
     const docId = await makeDocumentFromDb(dateSubmitted)
     const link = await generateShareableLink(docId);
     sendEmailToSchool(link, docData.studentData.ContactEmail)
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
  verifyBy(dateSubmitted, "Parent");
  await addParentDataToDb(dateSubmitted, payload);
  const docData = await getDocDataFromDb(dateSubmitted);
  console.log("docData: ", docData)
  console.log("verifiedBySupervisor: ", typeof docData.verifiedBySupervisor)
  if(docData.verifiedBySupervisor && !docData.formCreated){
    console.log("creating form-p")
     const docId = await makeDocumentFromDb(dateSubmitted);
     const link = await generateShareableLink(docId);
     sendEmailToSchool(link, docData.studentData.ContactEmail)
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
  const docData = await getDocDataFromDb(dateSubmitted);
  verifyBy(dateSubmitted, "School");
  addPermActivity(docData)
  sendSuccessEmailToStudent(docData.studentData.ContactEmail, docData.dateSubmitted)
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