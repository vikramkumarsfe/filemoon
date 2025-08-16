const {Schema, model, mongoose} = require("mongoose")

const ShareSchema = new Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : true
    },
    receiverEmail : {
        type : String,
        required : true,
    },
    file : {
        type : mongoose.Types.ObjectId,
        ref : 'File',
        required : true
    }
}, { timestamps : true })

const ShareModel = model('Share', ShareSchema)

module.exports = ShareModel