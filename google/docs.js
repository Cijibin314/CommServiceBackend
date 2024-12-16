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
  async function findTextIndex(docId, textToFind) {
  try {
    const docs = google.docs({ version: 'v1', auth: oAuth2Client });

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
//console.log("Full Text: ", fullText);
    // Find the index of the target text
    const index = fullText.indexOf(textToFind) + 27 + textToFind.length;
    console.log(`Index of "${textToFind}":`, index);
    return index;

  } catch (error) {
    console.error('Error finding text index:', error.message);
  }
}
//signerRole HAS to be either "Parent" or "Supervisor"
async function insertDrawing(docId, imageurl, signerRole){
  const index = await findTextIndex(docId, `Signature of ${signerRole}:`);
  insertDrawingByIndex(docId, imageurl, index);
}
exportAndUploadImage("1tgw7pl89KjODKqkvXqhqRL9-EAHXmAx_xxgCNv40bf0").then((imgUrl)=>{
    console.log("Url: " + imgUrl)
    insertDrawing("1qA7EVNkqVXTPTlyI9lNoWbDcfoRe8N1_nL_PkCtCOss", imgUrl, "Supervisor")
})
