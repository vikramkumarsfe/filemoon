const {Schema, model }= require("mongoose")
const bcrypt = require("bcrypt")

const UserSchema = new Schema({
    fullname : {
        type : String,
        trim : true,
        required : true,
        lowercase : true,
        maxlength : 50
    },
    mobile : {
        type : String,
        trim : true,
        required : true,
    },
    email : {
        type : String,
        trim : true,
        required : true,
        match : [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            {message : "invalid mail"}
        ]
    },
    password : {
        type : String,
        trim : true,
        required : true,
    }
}, { timestamps : true})

UserSchema.pre('save', async function  (next) {
    const count = await model('User').countDocuments( { mobile : this.mobile})

    if( count > 0)
    {
        throw next( new Error(" Mobile already exists!!"))
    }

    next()
})

UserSchema.pre('save', async function(next){
    const count = await model("User").countDocuments({ email : this.email})

    if(count > 0 )
    {
        throw next( new Error("Email already exists!!"))
    }

    next()
})

//password encryption
UserSchema.pre('save', async function(next) {
    const encryptedPassowrd = await bcrypt.hash(this.password.toString(), 12)
    this.password = encryptedPassowrd
    next()
})

const UserModel = model('User', UserSchema)



module.exports = UserModel