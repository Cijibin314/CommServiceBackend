const {oAuth2Client} = require('./oAuth2Client')
const { google } = require('googleapis');
const drive = google.drive({ version: 'v3', auth: oAuth2Client });

// Function to generate a shareable link for a specific file
async function generateShareableLink(fileId) {    
    try {
        // Update file permissions to allow anyone with the link to view it
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'writer', // The user can view the file
                type: 'anyone', // Anyone with the link can view
            },
        });

        // Get the shareable link
        const file = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink',
        });

        return file.data.webViewLink;
    } catch (error) {
        console.error('Error generating shareable link:', error);
    }
}
module.exports = {generateShareableLink}