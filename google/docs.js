let {oAuth2Client} = require('../globalVars')
oAuth2Client = oAuth2Client.getVal()
const { google } = require('googleapis');
const drive = google.drive({ version: 'v3', auth: oAuth2Client });
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