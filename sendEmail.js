require("dotenv").config();
const { google } = require('googleapis');
// Initialize the OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:3000/oauth2callback'
);
oAuth2Client.setCredentials({
  access_token: process.env.ACCESS_TOKEN,
  refresh_token: process.env.REFRESH_TOKEN,
})

// Define sendEmail function
async function sendEmail(to, subject, text) {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    // Create the email in the required format
    const emailLines = [
      `From: "Your Name" ihscommunityservice9@gmail.com`, // Replace with your email
      `To: ${to}`,
      `Subject: ${subject}`,
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

// Example usage
sendEmail('coltonflather@gmail.com', 'Test Subject', 'This is a test email.');

module.exports = {
  sendEmail
};
