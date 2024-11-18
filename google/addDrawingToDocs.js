const {oAuth2Client} = require('./oAuth2Client')
const { google } = require('googleapis');
const drive = google.drive({ version: 'v3', auth: oAuth2Client });
const { v4: uuidv4 } = require('uuid');

// google.drive('v3').channels.stop({
//   channelId: 'unique-channel-id'
// });


//rerurns channel id
//Sets it up so that when the drawing is changes, the endpoint of the server gets called
async function watchChanges(drawingFileId) {
    const channelId = 'unique-channel-id-' + uuidv4()
    const oneDayFromNow = Date.now() + 24 * 60 * 60 * 1000
    const channel = {
      id: channelId,  // Generate a random channel ID
      type: 'webhook',
      address: "https://ae20-2601-188-c880-e80-6c7a-448f-8ae3-8ac0.ngrok-free.app/api/receiveDrawingUpdate/",  // Your server's endpoint to receive changes
      payload: true,  // Include payload in the notification
      expirationTime: oneDayFromNow,  // Expire the channel after 24 hours
    };
  
    try {
      const res = await drive.files.watch({
        fileId: drawingFileId,
        requestBody: channel
      });
      console.log('Watching file changes:', res.data);
      return channelId
    } catch (error) {
      console.error('Error setting up change notification:', error);
    }
  }
// drive.channels.stop({
//     requestBody: {
//       id: "unique-channel-id-135fe280-6802-4b5c-bfff-df963f564dd8",  // The channel's unique ID
//       resourceId: "NgwNK7xk-s11-hxbWW4lqolYGPo",  // The file or resource ID
//     },
//   }).then(res=>console.log(res.data + " was stopped"))
//watchChanges("1OoVcEYvfgN7-7Nf7GL4x7HE27QNqJsFDXKgrhbCZhfo").then(res=>console.log(res));