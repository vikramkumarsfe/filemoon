const FileModel = require("../model/file.model")
const jwt =  require("jsonwebtoken")

const jwtVerify = async (req, res) =>{
    try 
    {
        const payload = await jwt.verify(req.body.token, process.env.JWT_SECRET)
        res.status(200).json(payload)

    }
     catch (err)
     {
        res.status(500).json({ message : err.message })
     }
}

module.exports = {
    jwtVerify
}