const jwt = require('jsonwebtoken')

const authorize = (req , res , next) => {

const authheads = req.headers.authorization

if(!authheads || !authheads.startsWith("Bearer ")){
    return res.status(201).json({message:"Unauthorized"})
}
try{
const token = authheads.split(" ")[1]
const decoded = jwt.verify(token , process.env.JWT_SECRET)
req.user = decoded
}catch(err){

    res.status(500).json({message :"Invalid or Expired token"})
}
next()

}

module.exports = authorize