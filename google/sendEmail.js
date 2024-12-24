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

async function sendEmailToSupervisor(supervisorEmail, volunteerOrganization, studentName, activities, dateStudentSubmitted){
  const title = `${studentName} has invited you to sign their community service form`
  const googleFormLink = "https://docs.google.com/forms/d/e/1FAIpQLScOeJ3Kozrzitkd82mTf5emD-wxxu0AD5gxKir-zoLSzuS_pw/viewform?usp=pp_url&entry.171355152="+dateStudentSubmitted
  let studentActivity = "<table><tr><td>Date/Hours</td><td>Notes if necassary</td></tr>"
  for(const activity of activities){
    let line = "<tr>"
    line += `<td>${activity[0]}</td>`
    line += `<td>${activity[1]}</td>`
    line += "</tr>"
    studentActivity += line
  }
  studentActivity += "</table>"
  const text = `
  Hi ${supervisorEmail},<br><br>
  You have previously participated in a community service activity with ${studentName} as a part of ${volunteerOrganization}.<br><br>
  At Ipswich High School, we require a form to be filled out to show that ${studentName} completed their community service.<br><br>
  You can fill out this google form to verify that the student has completed the activity: ${googleFormLink}<br><br>
  The activity is listed as: ${studentActivity}<br><br>
  ____Bottom Area. To Fill Out____`
  console.log("Sent this text: " + text)
  await sendEmail(supervisorEmail, title, text)
}
async function sendEmailToParent(parentEmail, volunteerOrganization, activities, studentName, dateStudentSubmitted){

}
setTimeout(()=>{
  sendEmailToSupervisor("coltonflather@gmail.com", "volunteerOrganization","studnetName",[
    [ 'hrs/date', 'notes' ],
    [ 'hrs2', 'notes2' ],
    [ '', '' ],
    [ '', '' ],
    [ '', '' ],
    [ '', '' ],
    [ 'hrs7', 'notes7' ]
  ],"formIddddd")
})

module.exports = {
  sendEmail
};
