//error indexes:
//0: invalid parent email
//1: invalid superisor email
//2: invalid total hours
const {sendRedoEmail} = require('./google/sendEmail')
function handleInvalidForm(email, errorIndex) {
    switch(errorIndex) {
        case 0:
            console.error(`Invalid parent email`);
            sendRedoEmail("Invalid parent email");
            break;
        case 1:
            console.error(`Invalid supervisor email`);
            sendRedoEmail("Invalid supervisor email");
            break;
        case 2:
            console.error(`Invalid total hours`);
            sendRedoEmail("Invalid total hours");
            break;
        default:
            console.error(`Invalid form error: index ${errorIndex}`);
            break;
    }
}
module.exports = {handleInvalidForm}