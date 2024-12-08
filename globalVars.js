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
let channelConnection = new globleVar()
let database = new globleVar()
let userConnection = new globleVar()
let oAuth2Client = new globleVar()
module.exports = {channelConnection, database, userConnection, oAuth2Client};