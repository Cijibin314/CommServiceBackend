let {oAuth2Client} = require('../globalVars')
oAuth2Client = oAuth2Client.getVal()
const { google } = require('googleapis');
const drive = google.drive({ version: 'v3', auth: oAuth2Client });
const fs = require('fs');
// Function to generate a shareable link for a specific file
async function generateShareableLink(docId) {    
    //const SOURCE_FOLDER_PATH = '/documents/forms';
    const EXPORT_FOLDER_PATH = '/exports';
    try {
        const fileName = `${docId}.pdf`;
        const exportPath = `${EXPORT_FOLDER_PATH}/${fileName}`;
    
        // Export the file as PDF and save it locally
        const res = await drive.files.export(
          {
            fileId: docId,
            mimeType: 'application/pdf',
          },
          { responseType: 'stream' }
        );
    
        // Ensure the export folder exists
        await fs.mkdir(EXPORT_FOLDER_PATH, { recursive: true });
    
        // Write the PDF to the export path
        await new Promise((resolve, reject) => {
          const dest = fs.createWriteStream(exportPath);
          res.data
            .pipe(dest)
            .on('finish', resolve)
            .on('error', reject);
        });
    
        console.log(`PDF exported to: ${exportPath}`);
    
        // Move the file to the /exports folder in Google Drive
        const fileMetadata = {
          name: fileName,
          parents: [EXPORT_FOLDER_PATH], // Replace with the correct Google Drive folder ID
        };
    
        const media = {
          mimeType: 'application/pdf',
          body: fs.createReadStream(exportPath),
        };
    
        const uploadRes = await drive.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: 'id',
        });
    
        const pdfId = uploadRes.data.id;
    
        // Create a sharable link
        await drive.permissions.create({
          fileId: pdfId,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });
    
        const sharableLink = `https://drive.google.com/file/d/${pdfId}/view`;
        console.log(`Sharable link: ${sharableLink}`);
    
        return sharableLink;
      } catch (error) {
        console.error('Error exporting document to PDF:', error.message);
        throw error;
      }
}

generateShareableLink("1XGRqFjr7FO3JVggjnjM1r0WwDIXBxM3dtYq1rY9wMEE").then(link=>{console.log(link)})
module.exports = {generateShareableLink}