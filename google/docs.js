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
async function insertDrawing(docId, imageUrl, index) {
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
exportAndUploadImage("1tgw7pl89KjODKqkvXqhqRL9-EAHXmAx_xxgCNv40bf0").then((imgUrl)=>{
    console.log("Url: " + imgUrl)
    insertDrawing("1SrhdsynSe9xuwakcId82P8TAzXwokbgkcTM7A8UZHCM", imgUrl, 1)
})
