require("dotenv").config();
const { google } = require('googleapis');
let {oAuth2Client} = require('../globalVars');
oAuth2Client = oAuth2Client.getVal()
const {generateShareableLink} = require('./getLinks')
// Define sendEmail function
async function sendEmail(to, subject, text) {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    // Create the email in the required format
    const emailLines = [
      `From: "Your Name" ihscommunityservice9@gmail.com`, // Replace with your email
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=UTF-8',
      '',
      text,
    ];

    const email = emailLines.join('\n');

    // Encode the email in base64url format
    const encodedMessage = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Send the email
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('Email sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

async function sendEmailToSigner(toEmail, drawingId, docId, userName){
  const title = `${userName} has invited you to sign their community service form`
  const docLink = await generateShareableLink(docId)
  const drawingLink = await generateShareableLink(drawingId)
  const docHelpLink = "_____docHelpLink____"
  const drawingHelpLink  = "_____signatureHelpLink_____"
  const text = `
  Hi ${toEmail},<br><br>
  You have previously participated in a community service activity with ${userName}.<br><br>
  At Ipswich High School, we require a form to be filled out to show that ${userName} completed their community service.<br><br>
  You can access their form and print your name and email in the designated spot at the bottom here: <a href="${docLink}">${docLink}</a> and sign that form here <strong>(use web browser)</strong>: <a href="${drawingLink}">${drawingLink}</a><br><br>
  Need technical help?<br>
  Go here for help adding your name and email: <a href="${docHelpLink}">${docHelpLink}</a><br>
  Go here for help adding your signature: <a href="${drawingHelpLink}">${drawingHelpLink}</a><br><br>
  
  ____Bottom Area. To Fill Out____`
  await sendEmail(toEmail, title, text)
}

//sendEmailToSigner("coltonflather@gmail.com", "1USLf3XXgplGt6bfIVl3xR27gwcNbu_RKvEq3a8pXrCg","1qA7EVNkqVXTPTlyI9lNoWbDcfoRe8N1_nL_PkCtCOss","Cole Flather")

module.exports = {
  sendEmail
};
