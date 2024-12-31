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
    if(prevActivity){
        const prevHours = prevActivity.totalHours;
        const newHours = prevHours + numHours;
        await activityConnection.getVal().updateOne({email: email}, {$set: {totalHours: newHours, activities: [...prevActivity.activities, {linkToForm: link, numHours: numHours}]}})
        console.log("Updated activity")
    }else{
        console.log("Adding new user")
        await addUser(email)
        addPermActivity(email, link, numHours)
    }
}
module.exports = {addPermActivity}