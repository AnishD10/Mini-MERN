const mongoose = require('mongoose')

const userSchema = mongoose.Schema({

    name : {type : String , required : true },
    email : {type : String , required : true , unique : true},
    password :  {type : String , required : true , select : false },
    role : {type : String , 
        enum : ['employee' , 'manager' , 'admin'],
        default: 'employee' }
    
    
})

module.exports = mongoose.model('User' , userSchema)