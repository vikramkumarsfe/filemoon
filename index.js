const dotenv = require("dotenv")
dotenv.config()

const mongoose = require("mongoose")
mongoose.connect(process.env.DB)


.then(()=>{console.log("success")})

.catch((err)=>{console.log(err.message)})

const express = require("express")
const cloudinary = require("cloudinary").v2;
const { v4: uniqueId } = require("uuid")
const path = require("path")

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const multer = require("multer")
// const storage = multer.diskStorage({
//     destination : (req, file, next)=>{
//         next(null, 'files/')
//     },
//     filename : (req, file, next)=>{
//         const nameArr = file.originalname.split(".")
//         const extn = nameArr.pop()
//         const name = `${uniqueId()}.${extn}`
//         next(null,name)
//     }
// })
const upload = multer({
    storage : multer.memoryStorage(),
    limits : {
        filesize : 10 * 1000 * 1000
    }
})

const { signup, login } = require("./controller/user.controller")
const { createFile, fetchFiles, deleteFiles, downloadFile } = require("./controller/file.controller")
const { fetchDashboard } = require("./controller/dashboard.controller")
const { jwtVerify } = require("./controller/jwt.controller")
const { shareFile, fetchShared } = require("./controller/share.controller")
const AuthMiddleWare = require("./middleware/auth.middleware")
const app = express()
app.listen(process.env.PORT || 8080)

app.use(express.static("view"))
app.use(express.json())
app.use(express.urlencoded({ extende : false }))
const root = process.cwd()

const getPath = (filename) =>{
    return path.join(root, "view", filename)
}

//UI API
app.get('/signup', (req, res)=>{
 const p = getPath("signUp.html")
 res.sendFile(p)
})

app.get('/login', (req, res)=>{
 const p = getPath("index.html")
 res.sendFile(p)
})

app.get('/', (req, res)=>{
 const p = getPath("index.html")
 res.sendFile(p)
})

app.get('/dashboard', (req, res)=>{
 const p = getPath("app/dashboard.html")
 res.sendFile(p)
})

app.get('/files', (req, res)=>{
 const p = getPath("app/myFiles.html")
 res.sendFile(p)
})
app.get('/history', (req, res)=>{
 const p = getPath("app/history.html")
 res.sendFile(p)
})


app.post('/api/signup', signup)
app.post('/api/login', login)
app.post('/api/file', AuthMiddleWare, upload.single('file'), createFile)
app.get('/api/file', AuthMiddleWare, fetchFiles)
app.delete('/api/file/:id',  deleteFiles)
app.get('/api/file/download/:id', downloadFile)
app.get('/api/dashboard', AuthMiddleWare, fetchDashboard)
app.post('/api/jwt/verify', jwtVerify)
app.post('/api/share/', AuthMiddleWare, shareFile)
app.get('/api/share/' ,AuthMiddleWare, fetchShared)

//Not found

app.use((req, res) => {
    res.status(404).json({message : " Endpoint is not found "})
})




