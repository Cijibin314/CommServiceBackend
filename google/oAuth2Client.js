require("dotenv").config();
const { google } = require('googleapis');
const {oAuth2Client} = require('../globalVars')
// Initialize the OAuth2 client
const oAuth2ClientLocal = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2ClientLocal.setCredentials({
  access_token: process.env.ACCESS_TOKEN,
  refresh_token: process.env.REFRESH_TOKEN,
})
oAuth2Client.setVal(oAuth2ClientLocal);