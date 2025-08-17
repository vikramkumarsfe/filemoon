const cloudinary = require("cloudinary").v2
const FileModel = require('../model/file.model')
const fs = require("fs")
const path = require("path")

const getType = (type) =>{
    const extn = type.split('/').pop()

    if(extn === 'x-msdownload')
        return "application/exe"

    return type
}

const getMimeType = (mime) =>{
    if (mime.startsWith("image/")) return "image"
    if (mime.startsWith("video/")) return "video"
    if (mime.startsWith("css/")) return "css"
    if (mime.startsWith("javascript/")) return "javascript"
    return row
}

const createFile = async (req,res) =>{
    try
    {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "filemoon",      // optional folder
            resource_type: "auto"     // allows pdf, images, videos, etc.
        });
        const file = req.file
        const payload = {
            path : result.secure_url,
            public_id: result.public_id, // so you can delete later if needed
            filename: req.body.filename || req.file.originalname,
            type: getType(file.mimetype),
            size: file.size,
            user : req.user.id,
        }

        const newFile = await FileModel.create(payload)
        res.status(200).json(newFile)
    }
    catch(err)
    {
        res.status(500).json({message : err.message})
    }
}

const fetchFiles = async (req, res) =>{
    try
    {
        const { limit } = req.query
        const files = await FileModel.find({user : req.user.id}).sort({ createdAt : -1}).limit(limit)
        res.status(200).json(files)
    }
    catch(err)
    {
        res.status(500).json({message : err.message })
    }
}

const deleteFiles = async (req, res) =>{
    try 
    {
        const {  id } = req.params
        const file = await FileModel.findById(id)


        if(!file)
            return res.status(500).json({ message : "file not found!!"})

        if (file.public_id) {
            const resourceType = getMimeType(file.type);
            await cloudinary.uploader.destroy(file.public_id, { resource_type: resourceType})
        }

        const deletedFile = await FileModel.findByIdAndDelete(id);

        res.status(200).json(deletedFile);
    }
    catch (err) 
    {
        res.status(500).json({message : err.message})
    }
}

const downloadFile = async (req, res) => {
    try 
    {
        const { id } = req.params
        const file = await FileModel.findById(id)
        const extn = file.type.split('/').pop()
        if(!file)
            return res.status(500).json({message: " file not found!"})

        // const filePath = file.path

        // res.setHeader('Content-Disposition',`attachment; filename="${file.filename}.${extn}"` );

        // res.sendFile(filePath , (err)=>{
        //     if(err)
        //         throw new Error("Failed to download the file")
        // })

        return res.redirect(file.path); 
    }
    catch(err)
    {
        res.status(500).json({message : err.message})
    }
}

module.exports = {
    createFile,
    fetchFiles,
    deleteFiles,
    downloadFile
}