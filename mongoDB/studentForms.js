const {studentFormConnection} = require('../globalVars')
const { v4: uuidv4 } = require('uuid');
async function insertStudentDataFromDb(docId){
    return "hi"
}
async function addStudentDataToDb(studentData){
    console.log("stufent form conn: " + await studentFormConnection.getVal())
    const doc = {
        "studentData": studentData
    }
    await studentFormConnection.getVal().insertOne(doc).catch(e=>console.log("Error adding channel: " + e))
    return ;
}
addStudentDataToDb({
    Name: 'Cole Flather',
    Activities: [
      [ 'activityOneHours', '' ],
      [ '', '' ],
      [ '', '' ],
      [ '', '' ],
      [ '', '' ],
      [ '', '' ],
      [ '', '' ]
    ],
    ContactEmail: '27....@ipsk12.net',
    Classof: '2027',
    StudentID: '3908651984687',
    VolunteerOrganization: 'volunteerOrg',
    Briefdescriptionofcommunityservice: 'description',
    TotalHours: '5',
    SupervisorEmail: 'supervisorEmail@gmail.com'
})
module.exports = {insertStudentDataFromDb, addStudentDataToDb};