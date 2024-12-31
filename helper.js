//error indexes:
//0: invalid parent email
//1: invalid superisor email
//2: invalid total hours
const { makeNewDocument, permissionsVerification, deleteDocument } = require('./google/docs');
const {sendRedoEmail} = require('./google/sendEmail')
const {schoolEmail} = require('./globalVars')
function handleInvalidForm(email, errorIndex) {
    switch(errorIndex) {
        case 0:
            console.log(`Invalid parent email`);
            sendRedoEmail(email, "Invalid parent email");
            break;
        case 1:
            console.log(`Invalid supervisor email`);
            sendRedoEmail(email, "Invalid supervisor email");
            break;
        case 2:
            console.log(`Invalid total hours`);
            sendRedoEmail(email, "Invalid total hours");
            break;
        case 3:
            console.log(`School deemed invalid`);
            sendRedoEmail(email,`School deemed invalid<br>
                An email should soon be sent by them explaining why. If this does not occur, then you can email them at ${schoolEmail}`);
            break;
        default:
            console.error(`Invalid form error: index ${errorIndex}`);
            break;
    }
}

async function validGoogleAccount(emailAddress) {
    let id = await makeNewDocument("testEmailAddress");
    try {
        await permissionsVerification(id, emailAddress)
        deleteDocument(id)
        return true;
    }
    catch(err) {
        deleteDocument(id)
        //console.log(err)
        return false;
    }
}
module.exports = {handleInvalidForm, validGoogleAccount}