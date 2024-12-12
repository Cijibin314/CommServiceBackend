let {oAuth2Client} = require('../globalVars')
oAuth2Client = oAuth2Client.getVal()
const { google } = require('googleapis');
const drive = google.drive({ version: 'v3', auth: oAuth2Client });
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

//returns the drawing id
async function createDrawing(drawingName) {
    try {
        // Step 1: Create the Google Drawing
        const folderId = "1cm-ihCHZcg_uSG7icjRGOD-e93KxDN30"
        const createResponse = await drive.files.create({
            auth: oAuth2Client,
            resource: {
                name: drawingName, // Name of the new Google Drawing
                mimeType: 'application/vnd.google-apps.drawing', // MIME type for Google Drawings
                parents: [folderId], // Specify the folder ID
            },
            fields: 'id', // Get only the file ID in response
        });

        const drawingId = createResponse.data.id;
        console.log(`Google Drawing created with ID: ${drawingId}`);

        return drawingId; // Return the drawing's ID
    } catch (error) {
        console.error('Error creating Google Drawing:', error.message);
        throw error;
    }
}

async function deleteDrawing(drawingId) {
    try {
        // Perform the delete operation
        await drive.files.delete({
            fileId: drawingId,
        });

        console.log(`Drawing with ID ${drawingId} has been deleted.`);
    } catch (error) {
        console.error('Error deleting Google Drawing:', error.message);
    }
}

async function exportAndUploadImage(fileId) {
    const newFileName = 'unique-drawing' + uuidv4()
    try {
      // Export the file as PNG
      const exportUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=image/png`;
      const response = await axios.get(exportUrl, {
        headers: { Authorization: `Bearer ${oAuth2Client.credentials.access_token}` },
        responseType: 'stream',
      });
  
      // Upload the file to the exports folder
      const fileMetadata = {
        name: `${newFileName}.png`,
        parents: ['1z3jvfNat1oVAmiH4CaKU8lwrxstlV_Bs'], // Exports folder ID
      };
      const media = {
        mimeType: 'image/png',
        body: response.data,
      };
  
      const uploadResponse = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webViewLink, webContentLink',
      });
  
      console.log('File uploaded:', uploadResponse.data);
      newId = uploadResponse.data.id;
      return newId;
  
    } catch (error) {
      console.error('Error exporting and uploading image:', error.message);
    }
  }
exportAndUploadImage("1tgw7pl89KjODKqkvXqhqRL9-EAHXmAx_xxgCNv40bf0")

