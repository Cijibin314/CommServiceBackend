let {oAuth2Client} = require('../globalVars')
oAuth2Client = oAuth2Client.getVal()
const { google } = require('googleapis');
const drive = google.drive({ version: 'v3', auth: oAuth2Client });
const { v4: uuidv4 } = require('uuid');
const {addChannel, getChannelId, getFileId, getResourceId, deleteChannel} = require('../mongoDB/channels')
const docs = google.docs({ version: "v1", auth: oAuth2Client });
//Sets it up so that when the drawing is changes, the endpoint of the server gets called
async function watchChanges(drawingFileId, channelName) {
    const channelId = 'unique-channel-id-' + uuidv4()
    const oneDayFromNow = Date.now() + 24 * 60 * 60 * 1000
    const channel = {
      id: channelId,  // Generate a random channel ID
      type: 'webhook',
      address: "https://8a20-2601-188-c502-49b0-649f-bb3f-cfa8-55d9.ngrok-free.app/api/receiveDrawingUpdate/" + channelName,  // Your server's endpoint to receive changes
      expirationTime: oneDayFromNow,  // Expire the channel after 24 hours
    };
  
    try {
      const res = await drive.files.watch({
        fileId: drawingFileId,
        requestBody: channel
      });
      await addChannel(channelId, drawingFileId, channelName, res.data.resourceId)
      console.log('Watching file changes:', channelName);
    } catch (error) {
      console.error('Error setting up change notification:', error);
    }
  }
async function stopChannel(channelName){
  drive.channels.stop({
    requestBody: {
      "id": await getChannelId(channelName),  // The channel's unique ID
      "resourceId": await getResourceId(channelName),  // The file or resource ID
    },
  }).then(()=>{
    console.log(channelName + " was stopped");
    deleteChannel(channelName)
    console.log("Channel: " + channelName + " sucesfully deleted")
  }).catch(e=>console.log("Error stopping channel: " + e))
}
async function handleDrawingUpdate(channelName){
  console.log("Update received: " + channelName)

}
async function uploadDrawing(fileId) {
  // Copy file and change MIME type to image/png
  // const response = await drive.files.copy({
  //     fileId: fileId,
  //     requestBody: {
  //         name: `ExportedDrawing_${Date.now()}`,
  //     },
  //     parents: ["1u5IIIr6rQgeusXJqNXr6G8xJROgnQeKy"]
  // });
  //Make the copied file publicly accessible
  // await drive.permissions.create({
  //     fileId: response.data.id,
  //     requestBody: {
  //         role: 'reader',
  //         type: 'anyone',
  //     },
  // });

  //Get the public file URL
  const fileReq1 = await drive.files.get({
      fileId: fileId,//response.data.id,
      fields: 'webContentLink',
  });
   console.log("Link: " + fileReq1.data.webContentLink)
  return fileReq1.data.webContentLink
}
async function insertDrawing(docId, fileId, index) {
  try {
    // Upload the drawing and get the public URL
    console.log("hi")
    const imageUrl = await uploadDrawing(fileId);
    console.log("Uploaded")
    // Fallback for size (use fixed size or approximate dimensions)
    const newWidth = 144;   // Use a fixed width or assume a reasonable value
    const newHeight = 540;   // Use a fixed height or assume a reasonable value
    const size = {
      height: { magnitude: newHeight, unit: 'PT' },   // Adjusted width
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
  } catch (error) {
    console.error('Error inserting drawing:', error.message);
  }
}
//insertDrawing("1SrhdsynSe9xuwakcId82P8TAzXwokbgkcTM7A8UZHCM", "1tgw7pl89KjODKqkvXqhqRL9-EAHXmAx_xxgCNv40bf0", 1)
setTimeout(()=>{
  //stopChannel("channel10").catch(err=>console.log(err));
  //watchChanges("1S5Ak-T4L6gZeN5xF93OMpigSl3YpAEBU8jMvUQA4u38", "channel11").catch(err=>console.log(err));
}, 5000)

module.exports = {watchChanges, stopChannel, handleDrawingUpdate}