# 🔐 AuthSecure - Enterprise Email OTP Authentication System (MERN Stack)

A production-ready, full-stack **Email OTP Authentication System** built with **React 19, Vite, Tailwind CSS, Framer Motion, Node.js, Express.js, MongoDB Atlas, Mongoose, Nodemailer, and JWT HTTP-Only Cookies**.

Inspired by modern design systems like **Stripe, Linear, Vercel, and Notion**.

---

## 🌟 Key Features

### 🛡️ Authentication & Verification
- **Registration**: Full Name, Email, Password, Confirm Password, real-time password strength meter, and Terms agreement checkbox.
- **6-Digit Email OTP**: Automated email delivery with 5-minute expiration window.
- **Smart OTP Input**: Auto-focus between digit boxes, backspace navigation, clipboard paste support, 60-second countdown timer, and resend limits (Max 3 resends).
- **Login with JWT**: Dual Access Token (15m) + Refresh Token (7d) strategy delivered via secure **HTTP-Only, SameSite Cookies**.
- **Forgot & Reset Password**: 3-step secure password reset with email OTP verification.

### 👤 Profile & User Management
- **Dashboard**: Welcome banner, verification badges, overview cards, and quick actions.
- **Profile Manager**: Change Full Name, select profile avatars, update password, and permanently delete account with modal confirmation dialog.

### 🎨 Design & UI
- **Modern Aesthetic**: Glassmorphism cards (`rounded-[20px]`), `#2563EB` primary blue, smooth indigo gradients, soft shadows, and subtle Framer Motion animations.
- **Dark Mode**: Seamless dark mode support using Tailwind CSS.
- **Toast Notifications**: Interactive feedback via `react-hot-toast`.

### 🔐 Security Architecture
- **Password Hashing**: Salt round 10 encryption via `bcryptjs`.
- **Brute-Force & Rate Limiting**: Endpoint throttling via `express-rate-limit`.
- **HTTP Security Headers**: Powered by `helmet`.
- **Input Sanitization & Validation**: Powered by `express-validator`.
- **CORS Protection**: Configured for credentialed cross-origin requests.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + Custom Glassmorphism System
- **Routing**: React Router DOM v6
- **State & HTTP**: React Context API + Axios
- **Form Management**: React Hook Form
- **Animations & Icons**: Framer Motion + Lucide React
- **Notifications**: React Hot Toast

### Backend (`/server`)
- **Runtime & Framework**: Node.js + Express.js
- **Database & ORM**: MongoDB Atlas + Mongoose
- **Tokens & Security**: JWT (jsonwebtoken), bcryptjs, Helmet, Express Rate Limit, Cookie Parser
- **Email Service**: Nodemailer (HTML Email Templates with fallback for local testing)

---

## 📁 Project Structure

```
email-otp/
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── OTPInput.jsx
│   │   │   ├── PasswordStrengthMeter.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── VerifyEmail.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── emailTemplates.js
│   │   ├── generateOTP.js
│   │   ├── generateToken.js
│   │   └── sendEmail.js
│   ├── validators/
│   │   └── authValidator.js
│   ├── .env.example
│   └── server.js
│
├── package.json
└── README.md
```

---

## 📡 API Documentation

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new account & send email OTP |
| `POST` | `/api/auth/verify-email` | Public | Verify 6-digit OTP code & activate account |
| `POST` | `/api/auth/login` | Public | Log in with email & password, sets HTTP-only cookies |
| `POST` | `/api/auth/resend-otp` | Public | Request a new 6-digit OTP (Max 3 resends) |
| `POST` | `/api/auth/forgot-password` | Public | Send password reset OTP |
| `POST` | `/api/auth/verify-reset-otp` | Public | Verify password reset OTP code |
| `POST` | `/api/auth/reset-password` | Public | Submit new password after verification |
| `POST` | `/api/auth/logout` | Public/Private | Clear authentication cookies & refresh token |
| `POST` | `/api/auth/refresh-token` | Public | Issue fresh access token from valid refresh token |

### User Endpoints (`/api/user`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/profile` | Private | Get authenticated user profile details |
| `PUT` | `/api/user/update-profile` | Private | Update full name and avatar |
| `PUT` | `/api/user/change-password` | Private | Update user password |
| `DELETE` | `/api/user/delete-account` | Private | Permanently delete user account |

---

## 🗄️ Database Schema

### User Schema (`models/User.js`)
```javascript
{
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  avatar: { type: String, default: 'https://images.unsplash.com/...' },
  isVerified: { type: Boolean, default: false },
  emailOTP: {
    code: String,
    expireAt: Date,
    attempts: Number,
    resendCount: Number,
    lastResendAt: Date
  },
  resetOTP: {
    code: String,
    expireAt: Date,
    attempts: Number,
    resendCount: Number,
    lastResendAt: Date,
    isVerified: Boolean
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  refreshToken: { type: String, select: false },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Quick Start Guide (Local Setup)

### Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or **MongoDB Atlas Connection URI**

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/email-otp-auth.git
cd email-otp-auth

# Install all dependencies (Root, Server, and Client)
npm run install:all
```

### 2. Configure Environment Variables

Create `server/.env` file inside the `server/` directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection String
MONGO_URI=mongodb://127.0.0.1:27017/email-otp-auth

# JWT Secrets & Expiry
JWT_ACCESS_SECRET=your_super_secret_access_key_change_in_production_123
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_in_production_456
JWT_REFRESH_EXPIRE=7d

# Frontend URL
CLIENT_URL=http://localhost:5173

# Email Transport (Nodemailer with Gmail App Password)
# Note: In development mode, if left blank, OTPs will log cleanly to terminal console.
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
FROM_EMAIL=noreply@authsecure.com
FROM_NAME="AuthSecure"
```

### 3. Run Development Servers

```bash
# Run server and client concurrently
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API Server**: `http://localhost:5000`

---

## 🌐 Deployment Guide

### 1. Database: MongoDB Atlas
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Cluster & Database.
3. Under **Database Access**, create a user with read/write permissions.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow Access from Anywhere for cloud deployment).
5. Copy your connection string (`mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname`).

### 2. Backend: Render
1. Sign up at [Render.com](https://render.com/).
2. Click **New +** -> **Web Service** and connect your GitHub repository.
3. Set Root Directory to `server`.
4. Set Build Command: `npm install`.
5. Set Start Command: `node server.js`.
6. Add Environment Variables (`MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL`, `SMTP_USER`, `SMTP_PASS`, `NODE_ENV=production`).

### 3. Frontend: Vercel
1. Sign up at [Vercel.com](https://vercel.com/).
2. Import your GitHub repository.
3. Select Framework Preset: **Vite**.
4. Set Root Directory to `client`.
5. Set Build Command: `npm run build` and Output Directory to `dist`.
6. Deploy!

---

## 📄 License

Distributed under the MIT License.
