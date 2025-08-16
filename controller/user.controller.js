const UserModel = require("../model/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const signup = async  (req, res) => {
    try 
    {
        const user = await UserModel.create(req.body)
        res.status(200).json({ message : "Profile created successfully"})
    }
    catch(err)
    {
        res.status(500).json({message : err.message})
    }
}

const login = async (req, res )=> {
    try
    {
        const { email , password } = req.body
        const user = await UserModel.findOne({ email : email})
        
        if(!user)
        {
            return res.status(404).json({ message : " User does not exists!"})
        }

        const isLogin = bcrypt.compareSync( password, user.password)

        if(!isLogin)
        {
            return res.status(401).json({ message : " password is incorrect "})
        }

        const payload = {
            email : user.email,
            mobile : user.mobile,
            fullname : user.fullname,
            id: user._id
        }

        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn : '7d' })

        res.status(200).json({ 
            message : "Login Success!!",
            token : token
        })
    }
    catch (err)
    {
        res.status(500).json({ message : err.message })
    }
}

module.exports = {
    signup,
    login
}