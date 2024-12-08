let {oAuth2Client} = require('../globalVars')
oAuth2Client = oAuth2Client.getVal()
const { google } = require('googleapis');
const drive = google.drive({ version: 'v3', auth: oAuth2Client });

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