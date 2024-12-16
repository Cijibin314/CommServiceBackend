let {oAuth2Client} = require('../globalVars')
oAuth2Client = oAuth2Client.getVal()
const { google } = require('googleapis');
const drive = google.drive({ version: 'v3', auth: oAuth2Client });
const { v4: uuidv4 } = require('uuid');
const {addChannel, getChannelId, getFileId, getResourceId, deleteChannel} = require('../mongoDB/channels')
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

module.exports = {watchChanges, stopChannel}