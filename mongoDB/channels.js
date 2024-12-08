const {channelConnection} = require('../globalVars')
async function addChannel(channelId, fileId, channelName){
    const doc = {"channelI": channelId, "fileId": fileId, "channelName": channelName};
    await channelConnection.getVal().insertOne(doc);
}
async function getChannelId(channelName){
    const channel = await channelConnection.getVal().findOne({"channelName": channelName});
    return channel["channelId"]
}
async function getFileId(){
    const channel = await channelConnection.getVal().findOne({"channelName": channelName});
    return channel["fildId"]
}
module.exports = {addChannel, getChannelId, getFileId};