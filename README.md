https://filemoon-1.onrender.com
# Filemoon

**Filemoon** is a secure file-sharing platform built with Node.js, Express, and MongoDB. It implements the MVC (Model-View-Controller) architecture to provide a seamless experience for uploading, sharing, and managing files.

## Features

- **User Authentication**: Sign up and log in securely, with JWT-based session management.
- **File Management**: Upload, view, and delete files using a modern web interface.
- **File Sharing**: Share files via email with secure download links that expire for enhanced security.
- **Dashboard**: View recent files, sharing activity, and file statistics.
- **Download & History**: Access shared/downloaded file history.
- **API Endpoints**: RESTful APIs for all major functionalities (file CRUD, sharing, dashboard, authentication).
- **Frontend**: Responsive interface using TailwindCSS and modern JavaScript (Axios, Notyf, Moment.js).

## Project Structure

- `/controller` - Contains business logic for users, files, dashboard, sharing, and JWT verification.
- `/model` - Mongoose schemas for data persistence.
- `/view` - Static frontend files (HTML, JS, CSS).
- `/middleware` - Authentication and other middlewares.
- `/files` - Directory for uploaded files.
- `index.js` - Main application entry point.

## API Overview

- `POST /api/signup` — Register a new user
- `POST /api/login` — Login and get JWT token
- `POST /api/file` — Upload a file (authenticated)
- `GET /api/file` — List user's files (authenticated)
- `DELETE /api/file/:id` — Delete a file
- `GET /api/file/download/:id` — Download file
- `POST /api/share/` — Share file via email (authenticated)
- `GET /api/share/` — List files shared by the user
- `GET /api/dashboard` — Get dashboard stats

## Technologies Used

- Node.js
- Express.js
- MongoDB & Mongoose
- Multer (file uploads)
- JWT (authentication)
- Nodemailer (email/file sharing)
- TailwindCSS (UI)
- Axios, Notyf, Moment.js (frontend)

## Getting Started

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Setup environment variables**  
   Create a `.env` file with:
   ```
   DB=<your-mongodb-uri>
   SMTP_EMAIL=<your-email>
   SMTP_PASSWORD=<your-email-password>
   ```
4. **Start the server**
   ```bash
   npm start
   ```
5. **Access the frontend**  
   Open your browser to `http://localhost:8080`

## Notes

- All static frontend assets are served from the `/view` directory.
- Uploaded files are stored in the `/files` folder.
- Email sharing uses Gmail for SMTP by default; for higher volume, consider SendGrid, Mailchimp, AWS SES, etc. (see `important.txt`).

## License

MIT

---

> **Filemoon** – Share everything without complications.
