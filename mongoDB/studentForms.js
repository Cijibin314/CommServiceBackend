let {studentFormConnection} = require('../globalVars')
const { ObjectId } = require('mongodb');
const {makeNewDocument, insertStudentData} = require('../google/docs')
async function insertStudentDataFromDb(formId){
    studentFormConnection = await studentFormConnection.getVal()
    const objectId = new ObjectId(formId);
    const form = await studentFormConnection.findOne({"_id": objectId}).catch(e=>console.log("Error finding form: " + e));
    if(form){
        const formData = form["studentData"];
        const docId = await makeNewDocument("Student Community Service Form"+formId)
        console.log("Created new document with iddddddd: " + docId);
        await insertStudentData(docId, formData);
        return docId;
    }else{
        console.log("No form found for id: " + formId);
    }
}
//returns the formId
async function addStudentDataToDb(studentData){
    studentFormConnection = await studentFormConnection.getVal()
    const doc = {
        "studentData": studentData,
        "verified": false,
    }
    await studentFormConnection.insertOne(doc).catch(e=>console.log("Error adding channel: " + e))
    const form = await studentFormConnection.findOne({"studentData": studentData}).catch(e=>console.log("Error getting studentData: " + e));
    return form["_id"].toString();
}
//string of formId 
// not tested yet
async function verifyStudentData(formId){
    studentFormConnection = await studentFormConnection.getVal()
    try{
        await studentFormConnection.updateOne({"_id": new ObjectId(formId)}, {$set: {"verified": true}});
    }catch(e){
        console.log("Error verifying student data: " + e);
    }
}
// setTimeout(()=>{
//     insertStudentDataFromDb("67699d4eafe7e256ae6c953f");
// },3000)
module.exports = {insertStudentDataFromDb, addStudentDataToDb};