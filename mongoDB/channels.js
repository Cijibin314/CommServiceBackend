const {channelConnection} = require('./connection')
console.log(channelConnection)
async function addChannelToDatabase(followId, channelName){
    const doc = {"followId": followId, "channelName": channelName};
    await channelConnection.insertOne(doc);
}
addChannelToDatabase("myFollowId", "myChannelName");