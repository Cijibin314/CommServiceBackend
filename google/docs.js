let {oAuth2Client} = require('../globalVars')
oAuth2Client = oAuth2Client.getVal()
const { google } = require('googleapis');
const drive = google.drive({ version: 'v3', auth: oAuth2Client });
const {exportAndUploadImage, deleteDrawing} = require('./drawings')
const docs = google.docs({ version: "v1", auth: oAuth2Client });
// Function to create a copy of a document and place it in a folder
//Returns the new documetn id
async function makeNewDocument(newTitle) {
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
async function insertDrawingByIndex(docId, imageUrl, index) {
    try {
      // Fallback for size (use fixed size or approximate dimensions)
      const width = 50;   // Use a fixed width or assume a reasonable value
      //const height = ;   // Use a fixed height or assume a reasonable value
      const size = {
        width: { magnitude: width, unit: 'PT' },   // Adjusted width
      }
      // Insert the image into the document
      const response = await docs.documents.batchUpdate({
        documentId: docId,
        requestBody: {
          requests: [
            {
              insertInlineImage: {
                uri: imageUrl,
                location: { index: index },
                objectSize: size,
              },
            },
          ],
        },
      });
  
      console.log('Image inserted successfully:', response.data);
      deleteDrawing(imageUrl)
    } catch (error) {
      console.error('Error inserting drawing:', error.message);
    }
  }
  //Returns the LAST index of the first occurence of the text
  async function findTextIndex(docId, textToFind) {
  try {

    // Fetch document content
    const doc = await docs.documents.get({ documentId: docId });
    const content = doc.data.body.content;

    // Extract full text, including tables
    let fullText = '';

    function extractText(elements) {
      elements.forEach(element => {
        if (element.paragraph) {
          element.paragraph.elements.forEach(elem => {
            if (elem.textRun && elem.textRun.content) {
              fullText += elem.textRun.content;
            }
          });
        } else if (element.table) {
          element.table.tableRows.forEach(row => {
            row.tableCells.forEach(cell => {
              extractText(cell.content);  // Recursive call for table cells
            });
          });
        }
      });
    }
    extractText(content);
    // Find the index of the target text
    //27 is to account for the offset
    //console.log("Full Text: ", fullText);
    const index = fullText.indexOf(textToFind) + textToFind.length;
    console.log(`Index of "${textToFind}":`, index);
    return index;

  } catch (error) {
    console.error('Error finding text index:', error.message);
  }
}
async function insertTextByIndex(docId, text, index) {
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
//signerRole HAS to be either "Parent" or "Supervisor"
async function insertDrawing(docId, imageurl, signerRole){
  const index = await findTextIndex(docId, `Signature of ${signerRole}: `);
  insertDrawingByIndex(docId, imageurl, index);
  const indexForDate = index + 7; //1 + "Date: ".length + 1= 7
  const date = new Date().toISOString().split('T')[0];
  console.log("Date: " + date)
  insertTextByIndex(docId, date, indexForDate);
}
async function insertSupervisorData(docId, obj){
  console.log("Inserting supervisor data: " + obj)
  await insertTextByIndex(docId, "<<<"+"h"+">>>", 151)
  // //Name
  // let prompt = "Signature of Supervisor: "//"Print Name of Supervisor: "
  // const nIndex = await findTextIndex(docId, prompt)+prompt.length;
  // await insertTextByIndex(docId, "<<<"+obj["Name"]+">>>", nIndex);  //await is needed because then they would inser on the wonng indexes because it would be the index before the other parts have been added
  // // //Email
  // prompt = "Email of Supervisor: "
  // const eIndex = await findTextIndex(docId, prompt)+prompt.length;
  // await insertTextByIndex(docId, "<<<"+obj["Email"]+">>>", eIndex);
  // //Phone
  // prompt = "Phone of Supervisor: "
  // const pIndex = await findTextIndex(docId, prompt)+prompt.length;
  // await insertTextByIndex(docId, "<<<"+obj["Phone"]+">>>", pIndex);
}
module.exports = {insertDrawing, insertSupervisorData}
