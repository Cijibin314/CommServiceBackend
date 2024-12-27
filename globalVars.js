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
        this.value = val;
    }
}
let database = new globleVar("database")
let userConnection = new globleVar("userConnection")
let docDataConnection = new globleVar("docDataConnection")
let oAuth2Client = new globleVar("oAuth2Client")
module.exports = {database, userConnection, oAuth2Client, docDataConnection};