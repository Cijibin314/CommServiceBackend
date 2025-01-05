let {docDataConnection} = require('../globalVars')
const {makeNewDocument, insertStudentData, insertParentData, insertSupervisorData} = require('../google/docs');
async function makeDocumentFromDb(dateSubmitted){
    //const objectId = new ObjectId(formId);
    docDataConnection.getVal().updateOne({"dateSubmitted": dateSubmitted}, {$set: {"formCreated": true}});
    const form = await docDataConnection.getVal().findOne({"dateSubmitted": dateSubmitted}).catch(e=>console.log("Error finding form: " + e));
    if(form){
        const docId = await makeNewDocument("Student Community Service Form"+dateSubmitted)
        await insertStudentData(docId, form)
        await insertParentData(docId, form)
        await insertSupervisorData(docId, form)
        return docId;
    }else{
        console.log("No form found for id: " + dateSubmitted);
    }
    return "Failure to insert student data from db with date: " + dateSubmitted;
}
//returns the formId
async function addStudentDataToDb(studentData){
    const doc = {
        "studentData": studentData,
        "parentData": null,
        "supervisorData": null,
        "verifiedByParent": false,
        "verifiedBySupervisor": false,
        "verifiedBySchool": false,
        "formCreated": false,
        "dateSubmitted": studentData.DateSubmitted
    }
    await docDataConnection.getVal().insertOne(doc).catch(e=>console.log("Error adding channel: " + e))
    //const form = await docDataConnection.findOne({"studentData": studentData}).catch(e=>console.log("Error getting studentData: " + e));
    //return form["_id"].toString();
}
async function addParentDataToDb(dateSubmitted, parentData){
    await docDataConnection.getVal().updateOne({"dateSubmitted": dateSubmitted}, {$set: {"parentData": parentData}});
}
async function addSupervisorDataToDb(dateSubmitted, supervisorData){
    await docDataConnection.getVal().updateOne({"dateSubmitted": dateSubmitted}, {$set: {"supervisorData": supervisorData}});
}
//string of formId 
// not tested yet
async function verifyBy(dateSubmitted, role){
    try{
        switch(role){
            case "Parent":
                await docDataConnection.getVal().updateOne({"dateSubmitted": dateSubmitted}, {$set: {"verifiedByParent": new Date()}});
                break;
            case "Supervisor":
                await docDataConnection.getVal().updateOne({"dateSubmitted": dateSubmitted}, {$set: {"verifiedBySupervisor": new Date()}});
                break;
            case "School":
                await docDataConnection.getVal().updateOne({"dateSubmitted": dateSubmitted}, {$set: {"verifiedBySchool": new Date()}});
                break;
            default:
                console.log("Invalid role: " + role);
                return "Invalid role";
        }
    }catch(e){
        console.log("Error verifying student data: " + e);
    }
}
async function getDocDataFromDb(dateSubmitted){
    const form = await docDataConnection.getVal().findOne({"dateSubmitted": dateSubmitted}).catch(e=>console.log("Error finding forms: " + e));
    if(form){
        return form;
    }else{
        console.log("No forms found");
    }
}
// setTimeout(()=>{
//     insertStudentDataFromDb("67699d4eafe7e256ae6c953f");
// },3000)
module.exports = {
    makeDocumentFromDb, 
    addStudentDataToDb, 
    verifyBy, 
    addParentDataToDb, 
    addSupervisorDataToDb, 
    getDocDataFromDb
};