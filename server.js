const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {usersModel} = require('./mongoDB/models/user');
// require("./google/sendEmail")
// require("./google/addDrawingToDocs")
// require("./google/docs")
// require("./google/drawings")
// require("./google/getLinks")
// require("./google/oAuth2Client")
//const oAuth2Client = require("./getEmailToken")
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

//handle conection. Simply testing purposes
//Set up endpoints
app.get('/api/getUser/:username',(req,res)=>{
    const username = req.params.username
    usersModel.findOne({username: username}).exec().then((result)=>{
      res.status(200);res.send(result)
    }).catch(err=>res.send(err));
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


// app.get('/oauth2callback', async (req, res) => {
//     const code = req.query.code;
  
//     if (code) {
//       try {
//         const { tokens } = await oAuth2Client.getToken(code);
//         oAuth2Client.setCredentials(tokens);
//         res.send('Authorization successful! You can close this tab.');
//         console.log('Tokens received:', tokens);
//       } catch (err) {
//         console.error('Error exchanging code for tokens:', err.response?.data || err.message);
//         res.send(`Error during authorization: ${err.message}`);
//       }
//     } else {
//       res.send('No code provided');
//     }
//   });
// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
