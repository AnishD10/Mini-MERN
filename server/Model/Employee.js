const mongoose = require('mongoose')

const employeeSchema = mongoose.Schema({

    "name" : {type:String , required:true },
    "email" : {type : String, required:true , unique: true},
    "role" :  {type : String },
    "isActive": { type: Boolean, default: false },

})

module.exports = mongoose.model("employee" , employeeSchema)