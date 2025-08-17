const FileModel = require("../model/file.model")
const mongoose = require("mongoose")

const fetchDashboard = async (req, res) =>{
    try 
    {
        const id = req.user.id
        const reports = await FileModel.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $group : {
                    _id : "$type",
                    total : { $sum : 1}
                }
            },
        ])

        res.status(200).json(reports)
    }
    catch( err )
    {
        res.status(500).json({message : err.message })
    }
}

module.exports = {
    fetchDashboard
}