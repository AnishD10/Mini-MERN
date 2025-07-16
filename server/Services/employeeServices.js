const employee = require('../Model/Employee')
const User = require('../Model/User')
const generatePassword = require('../utils/PasswordGenerator')
const bcrypt = require("bcryptjs")

const createEmployeeServices = async (newUserData) => {
let newEmployee
try{
    newEmployee = new employee(newUserData)
    await newEmployee.save()
}catch(err){
console.error(`employ creation failed ${err.message}`)
}

const tempPass = generatePassword()

let hashed 
try{

    hashed = await bcrypt.hash(tempPass, 10)

}catch(err){

console.error(`hashing failed${err.message}`)

}

try{

    const user = new User({name : newUserData.name,
        email : newUserData.email,
        role : "employee",
        password : hashed,
        employeeId : newEmployee._id
    })

    await user.save()


}catch(err){

    
    console.error(`user creation failed ${err.message}`)
    await employee.findByIdAndDelete(newEmployee._id)


}

  return {
    success: true,
    employee: newEmployee,
    userInfo: {
      email: newUserData.email,
      tempPass,
    },
  };
}

const emailExists = async (email) => {
  const emailCheck = await employee.findOne({ email });
  if (emailCheck) {
    return true;
  }
  return false;
};

module.exports = {createEmployeeServices , emailExists}