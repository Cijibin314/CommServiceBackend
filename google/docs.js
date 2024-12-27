let {oAuth2Client} = require('../globalVars')
const { google } = require('googleapis');
let drive, docs

let first = true;
function load(){
  if(first){//first time only
    first = false;
    oAuth2Client = oAuth2Client.getVal();
    drive = google.drive({ version: 'v3', auth: oAuth2Client });
    docs = google.docs({ version: "v1", auth: oAuth2Client });
  }
}
// Function to create a copy of a document and place it in a folder
//Returns the new documetn id
async function makeNewDocument(newTitle) {
  await load()
    try {
        // Create a copy of the source document
        const response = await drive.files.copy({
            fileId: "18rqHYq6RjMQibKVBnJxrPK6PkRnPThenxbMpve30ruQ",//Source doc id
            requestBody: {
                name: newTitle, // Name of the new document
                parents: ["1j6GeXQcBze9Z3ci2fTJ3dX_tVyEn9aLv"], // Place the document in the specified folder
            },
        });

        const newDocId = response.data.id; // Get the ID of the new document
        console.log(`New document created with ID: ${newDocId}`);
        return newDocId;
    } catch (error) {
        console.error('Error creating document copy:', error.message);
        throw error;
    }
}
//Returns the index of where to append after the textToFind
async function insertTextByIndex(docId, text, index) {
  await load()
  try{
    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: index },
              text: text,
            },
          },
        ],
      },
    });

    console.log(`Inserted text "${text}" at index ${index}`);
  } catch (error) {
    console.error('Error inserting text:', error.message);
  }
}
async function findTextIndex(docId, textToFind){
  await load()
  const doc = await docs.documents.get({ documentId: docId });
  const content = doc.data.body.content;
  for(let i = 1; i < content.length; i++){
    const section = content[i]
    if(section.paragraph){  //text
      const elements = section.paragraph.elements;
      for(const element of elements){
        const text = element.textRun.content;
        if(text.includes(textToFind)){
          return element.startIndex + textToFind.length;
        }
      }
    }
    else if(section.table){
      const tableRows = section.table.tableRows;
      for(const tableRow of tableRows){
        const cells = tableRow.tableCells;
        for(const cell of cells){  //cells.length SHOULd be 2
          //console.log("Paragraph: " + JSON.stringify(cell))
          const elements = cell.content[0].paragraph.elements; //should only be one element
          const startIndex = cell.content[0].startIndex;
          for(const element of elements){
            const text = element.textRun.content;
            //console.log("Text: " + text)
            if(text.includes(textToFind)){
             // console.log("StartIndex: " + startIndex)
             // console.log("Index: " + (startIndex+textToFind.length))
              return startIndex + textToFind.length;
            }
          }
        }
      }
    }
  }
  return -1;
}
async function insertSupervisorData(docId, docData){
  const supervisorData = docData["supervisorData"];
  await load()
  console.log("Inserting supervisor data: " + supervisorData)
  //await insertTextByIndex(docId, "<<<"+"h"+">>>", await findTextIndex(docId, prompt))
  //Name
  try{
    let prompt = "Print Name of Supervisor: "//"Print Name of Supervisor: "
    const nIndex = await findTextIndex(docId, prompt);
    await insertTextByIndex(docId, supervisorData["Name"], nIndex);  //await is needed because then they would inser on the wonng indexes because it would be the index before the other parts have been added
    //Phone
    prompt = "Phone of Supervisor: "
    const pIndex = await findTextIndex(docId, prompt);
    await insertTextByIndex(docId, supervisorData["Phone"], pIndex);
    //Email
    prompt = "Email of Supervisor: "
    const eIndex = await findTextIndex(docId, prompt);
    await insertTextByIndex(docId, supervisorData["Email"], eIndex);
    //Signature
    prompt = "Signature of Supervisor: "
    const sIndex = await findTextIndex(docId, prompt);
    await insertTextByIndex(docId, supervisorData["PrintFullName(validassignature)"], sIndex);
    //Date of signature
    const dIndex = sIndex + supervisorData["PrintFullName(validassignature)"].length + 1 + 6;//6 is "Date: ".length
    await insertTextByIndex(docId, docData["verifiedBySupervisor"], dIndex);
  }catch(e){
    console.log("Error propably because document has been tampered")
    console.log("Error inserting supervisor data: " + e)
  }
}
async function insertStudentData(docId, docData){
  await load()
  console.log("Inserting studenttttt data: " + docData)
  //Name
  try{
    const studentData = docData["studentData"];
    //Name
    let prompt = "Student Name: "
    const nIndex = await findTextIndex(docId, prompt);
    await insertTextByIndex(docId, studentData["Name"], nIndex);  //await is needed because then they would insert on the wrong indexes because it would be the index before the other parts have been added
    //Email
    prompt = "Contact Email: "
    const eIndex = await findTextIndex(docId, prompt);
    await insertTextByIndex(docId, studentData["ContactEmail"], eIndex);
    //Class
    prompt = "Class of: "
    const cIndex = await findTextIndex(docId, prompt);
    await insertTextByIndex(docId, studentData["Classof"], cIndex);
    //Student ID
    prompt = "Student ID: "
    const iIndex = await findTextIndex(docId, prompt);
    await insertTextByIndex(docId, studentData["StudentID"], iIndex);
    //Total Hours
    prompt = "Total Hours from above: "
    const hIndex = await findTextIndex(docId, prompt);
    await insertTextByIndex(docId, studentData["TotalHours"], hIndex);
    //Description of Comm Service
    prompt = "Brief description of community service: "
    const dIndex = await findTextIndex(docId, prompt);
    await insertTextByIndex(docId, studentData["Briefdescriptionofcommunityservice"], dIndex+1);
    //Volunteer Organization
    prompt = "Volunteer Organization: "
    const oIndex = await findTextIndex(docId, prompt);
    await insertTextByIndex(docId, studentData["VolunteerOrganization"], oIndex);
    //Supervisor Email
    prompt = "Email of Supervisor: "
    const sIndex = await findTextIndex(docId, prompt);
    await insertTextByIndex(docId, studentData["SupervisorEmail"], sIndex);
    //Activity(Table)
    //const distanceBetweenCells = 3;
    const activities = studentData["Activities"]
    console.log("Activities: " + activities)
    let aIndex = await findTextIndex(docId, "Notes if necessary")+3;
    for(const activity of activities){
      if(activity[0]){
        await insertTextByIndex(docId, activity[0], aIndex);
        aIndex += activity[0].length + 2;
      }else{
        aIndex+=2;
      }
      if(activity[1]){
        await insertTextByIndex(docId, activity[1], aIndex);
        aIndex += activity[1].length + 3;
      } else{
        aIndex+=3;
      }
    }
  }catch(e){
    console.log("Error propably because document has been tampered")
    console.log("Error inserting supervisor data: " + e)
  }
}
async function insertParentData(docId, docData){
  //Signature
  let prompt = "Signature of Parent: "
  const sIndex = await findTextIndex(docId, prompt);
  await insertTextByIndex(docId, docData.parentData["PrintFullName(validassignature)"], sIndex);
  //Date of signature
  const dIndex = sIndex + docData.parentData["PrintFullName(validassignature)"].length + 1 + 6;//6 is "Date: ".length
  await insertTextByIndex(docId, docData["verifiedByParent"], dIndex);
}
module.exports = {insertParentData, insertSupervisorData, insertStudentData, makeNewDocument}
