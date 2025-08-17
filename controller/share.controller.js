const ShareModel = require('../model/share.model')
const FileModel = require('../model/file.model')
const nodemailer = require("nodemailer")

const conn = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.SMTP_EMAIL,
        pass : process.env.SMTP_PASSWORD
    }
})

const getEmailTemplate = (link ,file) =>{
    return `
    <!DOCTYPE html>
        <html lang="en" style="margin:0; padding:0;">
        <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Filemoon - Secure File Delivery</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

        <!-- Outer Wrapper -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f4f6f8; padding:24px 0;">
            <tr>
            <td align="center">

                <!-- Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">

                <!-- Header -->
                <tr>
                    <td style="background-color:#1e3a8a; padding:20px 24px; text-align:center; color:#ffffff;">
                    <h1 style="margin:0; font-size:24px; font-weight:bold;">Filemoon</h1>
                    <p style="margin:4px 0 0 0; font-size:14px; opacity:0.9;">Share everything without complications</p>
                    </td>
                </tr>

                <!-- Title -->
                <tr>
                    <td style="padding:28px 24px 8px 24px; color:#111827;">
                    <h2 style="margin:0; font-size:20px; font-weight:bold;">You’ve received a file</h2>
                    </td>
                </tr>

                <!-- Message -->
                <tr>
                    <td style="padding:0 24px; color:#374151; font-size:14px; line-height:22px;">
                    <p style="margin:0;">The file below is ready for you to download using a secure link. Please note: this link will expire for security reasons.</p>
                    </td>
                </tr>

                <!-- File Info Card -->
                <tr>
                    <td style="padding:16px 24px;">
                    <table role="presentation" width="100%" style="background-color:#f9fafb; border:1px solid #e5e7eb; border-radius:8px;">
                        <tr>
                        <td style="padding:12px 16px;">
                            <table role="presentation" width="100%">
                            <tr>
                                <td valign="top" width="40" style="padding-right:10px;">
                                <div style="width:40px; height:40px; border-radius:6px; background-color:#e0e7ff; text-align:center; line-height:40px; font-size:18px;">📄</div>
                                </td>
                                <td valign="top">
                                <strong style="display:block; font-size:14px; color:#111827;">${file.filename}</strong>
                                <span style="font-size:12px; color:#6b7280;">Size:${file.size} • Sent: {{sent_datetime}}</span>
                                </td>
                                <td valign="top" align="right">
                                <div style="font-size:12px; color:#6b7280;">Expires</div>
                                <div style="font-size:13px; color:#b91c1c; font-weight:bold;">{{expiry_datetime}}</div>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>

                <!-- Download Button -->
                <tr>
                    <td align="center" style="padding:12px 24px 8px 24px;">
                    <a href="${link}" style="background-color:#1e3a8a; color:#ffffff; display:inline-block; padding:12px 24px; font-size:16px; font-weight:bold; border-radius:6px; text-decoration:none;">
                        Download File
                    </a>
                    </td>
                </tr>

                <!-- Expiration Note -->
                <tr>
                    <td style="padding:8px 24px; font-size:13px; color:#374151;">
                    Link valid until <strong>{{expiry_datetime}}</strong> or for <strong>{{expiry_hours}} hours</strong> from sending time.
                    </td>
                </tr>

                <!-- Divider -->
                <tr>
                    <td style="padding:16px 24px 0 24px;">
                    <hr style="border:none; height:1px; background-color:#e5e7eb;">
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="padding:16px 24px; font-size:12px; color:#6b7280;">
                    This file was sent to <strong>{{recipient_email}}</strong>.<br>
                    © {{current_year}} Filemoon. All rights reserved.
                    </td>
                </tr>

                </table>

            </td>
            </tr>
        </table>

        </body>
        </html>
        `
}
const shareFile = async (req, res) => {
    try {
        const { email , fieldId } = req.body
        const file = await FileModel.findById(fieldId)

        if(!file)
            return res.status(500).json({ message : "file not Found!!"})
        
        const link = `${process.env.DOMAIN}/api/file/download/${fieldId}`
        const options = {
            from :  process.env.SMTP_EMAIL,
            to : email,
            subject : 'Filemoon - New file received',
            html : getEmailTemplate(link, file)
        }

        const payload = {
            user : req.user.id,
            receiverEmail : email,
            file : fieldId,

        }

        await Promise.all([
            conn.sendMail(options),
            ShareModel.create(payload)
        ])
        res.status(200).json({message : ' email sent'})
    }
    catch (err)
    {
        res.status(500).json({ message : err.message })
    }
}


const fetchShared = async(req, res) =>{
    try {
        const { limit } = req.query
        const history = await ShareModel.find({user : req.user.id})
        //.populate('user', 'fullname email mobile', '-_id')
        .populate('file', 'filename size').sort({createdAt : -1}).limit(limit)

        console.log(history)
        res.status(200).json(history)
    }
    catch(err)
    {
        res.status(500).json({ message : err.message })
    }
}

module.exports = {
    shareFile,
    fetchShared
}