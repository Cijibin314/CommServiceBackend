class globleVar{
    constructor(name){
        this.value = null;
        this.name = name;
    }
    getVal(){
        if(this.value == null){
            console.log("Warning: No set value for var: " + this.name + "!!")
        }
        return this.value;
    }
    setVal(val){
        console.log("Set value for "+this.name + " to: " + val);
        this.value = val;
    }
}
let database = new globleVar("database")
let activityConnection = new globleVar("activityConnection")
let docDataConnection = new globleVar("docDataConnection")
let oAuth2Client = new globleVar("oAuth2Client")
module.exports = {database, activityConnection, oAuth2Client, docDataConnection};