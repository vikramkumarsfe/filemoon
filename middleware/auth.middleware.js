const jwt = require("jsonwebtoken")

const AuthMiddleWare = (req, res, next) =>{
    try 
    {
        const { authorization } = req.headers
        // Checking authorization key is not exists
        if(!authorization)
            return res.status(410).json({message : "Inavalid Request!"})

        const [type, token ] = authorization.split(" ")
        
        //checking type is bearer or not

        if(type !== "Bearer")
            return res.status(410).json({message : "Inavalid Request!"})

        //verifyng the token
        const user = jwt.verify(token , process.env.JWT_SECRET)

        req.user = user
        next()
    }

    catch (err)
    {
        res.status(401).json({ message : "Invaid token"})
    }


}

module.exports = AuthMiddleWare

/*
    1.firstly check the authorization is received or not
    2.check token is bearer or not
    3. validate the token with secret
    4.Inject the user with request
    5. Forward the request
*/