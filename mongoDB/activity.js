let {activityConnection} = require('../globalVars')
async function addUser(email){
    const user = {
        email: email,
        activities: [],
        totalHours: 0
    }
    await activityConnection.getVal().insertOne(user)
}
async function addPermActivity(email, link, numHours){
    const prevActivity = await activityConnection.getVal().findOne({email: email}).catch(e=>console.log("Error finding user: " + e))
    const prevHours = prevActivity.totalHours;
    const newHours = prevHours + numHours;
    await activityConnection.getVal().updateOne({email: email}, {$set: {totalHours: newHours, activities: [...prevActivity.activities, {linkToForm: link, numHours: numHours}]}})
}
setTimeout(()=>{
    addPermActivity("27flatherc@ipsk12.net", "https...link", 5)
},4000)
module.exports = {addPermActivity}