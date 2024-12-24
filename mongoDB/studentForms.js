let {studentFormConnection} = require('../globalVars')
const { ObjectId } = require('mongodb');
const {makeNewDocument, insertStudentData} = require('../google/docs')
async function insertStudentDataFromDb(dateSubmitted){
    studentFormConnection = await studentFormConnection.getVal()
    //const objectId = new ObjectId(formId);
    const form = await studentFormConnection.findOne({"dateSubmitted": dateSubmitted}).catch(e=>console.log("Error finding form: " + e));
    if(form){
        const formData = form["studentData"];
        const docId = await makeNewDocument("Student Community Service Form"+formId)
        console.log("Created new document with iddddddd: " + docId);
        await insertStudentData(docId, formData);
        return docId;
    }else{
        console.log("No form found for id: " + formId);
    }
    return "Failure"
}
//returns the formId
async function addStudentDataToDb(studentData){
    studentFormConnection = await studentFormConnection.getVal()
    const doc = {
        "studentData": studentData,
        "verifiedByParent": false,
        "verifiedBySupervisor": false,
        "alreadyAdded": false,
        "dateSubmitted": studentData.DateSubmitted
    }
    await studentFormConnection.insertOne(doc).catch(e=>console.log("Error adding channel: " + e))
    //const form = await studentFormConnection.findOne({"studentData": studentData}).catch(e=>console.log("Error getting studentData: " + e));
    //return form["_id"].toString();
}
//string of formId 
// not tested yet
async function verifyStudentDataSupervisor(dateSubmitted){
    studentFormConnection = await studentFormConnection.getVal()
    try{
        await studentFormConnection.updateOne({"DateSubmitted": dateSubmitted}, {$set: {"verifiedBySupervisor": true}});
    }catch(e){
        console.log("Error verifying student data: " + e);
    }
}
async function verifyStudentDataParent(dateSubmitted){
    studentFormConnection = await studentFormConnection.getVal()
    try{
        await studentFormConnection.updateOne({"DateSubmitted": dateSubmitted}, {$set: {"verifiedByParent": true}});
    }catch(e){
        console.log("Error verifying student data: " + e);
    }
}
// setTimeout(()=>{
//     insertStudentDataFromDb("67699d4eafe7e256ae6c953f");
// },3000)
module.exports = {insertStudentDataFromDb, addStudentDataToDb, verifyStudentDataSupervisor, verifyStudentDataParent};