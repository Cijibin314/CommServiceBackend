const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {usersModel} = require('./databaseCommands/models');
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.CONNECTIONSTRING)
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => console.error("MongoDB connection error:", err));

//handle conection. Simply testing purposes
//Set up endpoints
app.get('/api/getUser/:username',(req,res)=>{
    const username = req.params.username
    usersModel.findOne({username: username}).exec().then((result)=>{
      res.status(200);res.send(result)
    }).catch(err=>res.send(err));
})
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
