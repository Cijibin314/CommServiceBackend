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

async function sendEmailToSupervisor(studentData){
  const title = `${studentData.Name} has invited you to sign their community service form as their supervisor`
  const googleFormLink = "https://docs.google.com/forms/d/e/1FAIpQLScOeJ3Kozrzitkd82mTf5emD-wxxu0AD5gxKir-zoLSzuS_pw/viewform?usp=pp_url&entry.171355152="+studentData.DateSubmitted
  let studentActivity = "<table><tr><td>Date/Hours</td><td>Notes if necassary</td></tr>"
  for(const activity of studentData.Activities){
    let line = "<tr>"
    line += `<td>${activity[0]}</td>`
    line += `<td>${activity[1]}</td>`
    line += "</tr>"
    studentActivity += line
  }
  studentActivity += "</table>"
  const text = `
  Hi ${studentData.SupervisorEmail},<br>
  You have previously participated in a community service activity with ${studentData.Name} as a part of ${studentData.VolunteerOrganization}.<br>
  At Ipswich High School, we require a form to be filled out to show that ${studentData.Name} completed their community service.<br>
  You can fill out this google form to verify that the student has completed the activity: ${googleFormLink}<br>
  The activity is listed as: ${studentActivity}<br>
  ____Bottom Area. To Fill Out____`
  await sendEmail(studentData.SupervisorEmail, title, text)
}
async function sendEmailToParent(studentData){
  const title = `${studentData.Name} has invited you to sign their community service form as their parent`
  const googleFormLink = "https://docs.google.com/forms/d/e/1FAIpQLSddpekqibVqSSI0QDLHoPC86WLUWr_8RTH6cnMFFD5e09hA1Q/viewform?usp=pp_url&entry.1468050593="+studentData.DateSubmitted
  let studentActivity = "<table><tr><td>Date/Hours</td><td>Notes if necassary</td></tr>"
  for(const activity of studentData.Activities){
    let line = "<tr>"
    line += `<td>${activity[0]}</td>`
    line += `<td>${activity[1]}</td>`
    line += "</tr>"
    studentActivity += line
  }
  studentActivity += "</table>"
  const text = `
  Hi ${studentData.ParentEmail},<br>
  Your child has previously participated in a community service activity with ${studentData.SupervisorEmail} as a part of ${studentData.VolunteerOrganization}.<br>
  At Ipswich High School, we require a form to be filled out to show that ${studentData.Name} completed their community service.<br>
  You can fill out this google form to verify that your child has completed the activity: ${googleFormLink}<br>
  The activity is listed as: ${studentActivity} <br>Total Hours: ${studentData.TotalHours}<br>
  ____Bottom Area. To Fill Out____`
  await sendEmail(studentData.ParentEmail, title, text)
}
async function sendEmailToSchool(link){
  const formLink = "___formLink___"
  const title = `A student has invited completed their community service form`
  const text = `
  Hi,<br><br>
  A student has previously participated in a community service activity. Their form has been filled out by their parent/gardian and supervisor. The form can be found here: ${link} <br>
  Please assure that the email addresses of the parent and supervisor are valid. Afterwards, please fill out this form: ${formLink} to add their activity permanently<br>
  ____Bottom Area. To Fill Out____`
  await sendEmail("coltonflather@gmail.com", title, text)
}
async function sendConfirmationEmailToSchool(studentData){
  //console.log("Sending confirmation email to school: " + studentData)
}

module.exports = {
  sendEmailToSupervisor,
  sendEmailToParent,
  sendEmailToSchool,
  sendConfirmationEmailToSchool
};
