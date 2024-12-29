let {oAuth2Client} = require('../globalVars')
const { google } = require('googleapis');
const { Readable } = require('stream');
let drive;
let first = true;
function load(){
  if(first){//first time only
    first = false;
    oAuth2Client = oAuth2Client.getVal();
    drive = google.drive({ version: 'v3', auth: oAuth2Client });
  }
}
// Function to generate a shareable link for a specific file
async function generateShareableLink(docId) {
  await load();

  try {
    const exportResponse = await drive.files.export(
      {
        fileId: docId,
        mimeType: 'application/pdf',
      },
    );
    const buffer = Buffer.from(await exportResponse.data.arrayBuffer());
    const pdfStream = Readable.from(buffer);
    const newFile = await drive.files.create({
      requestBody: {
        name: 'exported_file.pdf',
        parents: ["1z3jvfNat1oVAmiH4CaKU8lwrxstlV_Bs"],
        mimeType: 'application/pdf',
      },
      media: {
        body: pdfStream
      }
    });
    
    const id = newFile.data.id;
    //permissions
    await drive.permissions.create({
      fileId: id,
      requestBody: {
        role: 'reader',
        type: "anyone"
      },
    })
    const shareLink = `https://drive.google.com/file/d/${id}/view`
    return shareLink;
  } catch (error) {
    console.error('Error exporting, uploading, or sharing the file:', error);
    throw error;
  }
}


module.exports = {generateShareableLink}