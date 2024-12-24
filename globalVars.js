class globleVar{
    constructor(){
        this.value = null;
    }
    getVal(){
        if(this.value == null){
            console.log("Warning: No set value!!!")
        }
        return this.value;
    }
    setVal(val){
        this.value = val;
    }
}
let database = new globleVar()
let userConnection = new globleVar()
let studentFormConnection = new globleVar()
let oAuth2Client = new globleVar()
module.exports = {database, userConnection, oAuth2Client, studentFormConnection};