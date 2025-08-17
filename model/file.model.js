const { Schema , model, mongoose} = require("mongoose")

const FileSchema = new Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref: 'User',
        required : true
    },
    filename : {
        type : String,
        require : true,
        lowercase : true,
        trim : true
    },
    path : {
        type : String,
        require : true,
        lowercase : true,
        trim : true
    },
    type : {
        type : String,
        trim : true,
        lowercase : true,
        required : true
    },
    size : {
        type : Number,
        required : true
    },
    public_id :{
        type : String,

    }
}, { timestamps : true})

const FileModel = model("File", FileSchema)

module.exports = FileModel