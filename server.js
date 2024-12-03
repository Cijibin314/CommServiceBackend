const express = require('express');
const globalVars = require('./globalVars')
const cors = require('cors');
require("./mongoDB/channels")
require("dotenv").config();

const app = express();

// Middleware
async function checkIfConnected(req, res, next) {
  if(globalVars.userConnection && globalVars.channelConnection && globalVars.database){
    next();
  }else{
    console.log("Not connected to mongodb")
    res.status(460).json({message: 'User not connected'})
  }
}
app.use(express.json());
app.use(cors());
app.use(checkIfConnected)

//handle conection. Simply testing purposes
//Set up endpoints
app.get('/api/getUser/:username',(req,res)=>{
    const username = req.params.username
    res.status(200).send(username)
})

app.get('/api/receiveDrawingUpdate/', (req, res)=>{
  console.log("Drawing just changed")
})
let num = 0;
app.post('/api/receiveDrawingUpdate/', (req, res)=>{
  console.log("Drawing just changed post: " + num)
  num++
})


app.post('/api/addActivityForm', (req,res)=>{
    const username = req.body["userame"]
    const activity = req.body["activity"]

})
app.post('/api/addActivityPdf', (req,res)=>{

})
app.post('/api/addUser', (req,res)=>{

})
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
