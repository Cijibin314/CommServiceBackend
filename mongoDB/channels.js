const {channelConnection} = require('../globalVars')
async function addChannel(channelId, fileId, channelName, resourceId){
    const doc = {
        "channelId": channelId, 
        "fileId": fileId, 
        "channelName": channelName, 
        "resourceId": resourceId
    };
    await channelConnection.getVal().insertOne(doc).catch(e=>console.log("Error adding channel: " + e))
}
async function getChannelId(channelName){
    const channel = await channelConnection.getVal().findOne({"channelName": channelName}).catch(e=>console.log("Error getting channel id: " + e));
    return channel["channelId"]
}
async function getFileId(channelName){
    const channel = await channelConnection.getVal().findOne({"channelName": channelName}).catch(e=>console.log("Error getting file id: " + e));
    return channel["fileId"]
}
async function getResourceId(channelName){
    const channel = await channelConnection.getVal().findOne({"channelName": channelName}).catch(e=>console.log("Error getting file id: " + e));
    return channel["resourceId"]
}
async function deleteChannel(channelName){
    await channelConnection.getVal().deleteOne({"channelName": channelName}).catch(e=>console.log("Error deleting channel: " + e));
}
async function getChannelName(channelId){
    const channel = await channelConnection.getVal().findOne({"channelId": channelId}).catch(e=>console.log("Error getting file id: " + e));
    try{
        return channel["channelName"]
    }catch{/*channel not found*/}
}
module.exports = {addChannel, getChannelId, getFileId, getResourceId, getChannelName, deleteChannel};