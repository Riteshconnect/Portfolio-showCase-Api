# Portfolio ShowCase API

A backend API for my personal portfolio built with **Node.js + TypeScript + Express**.  
Includes authentication (JWT), file uploads (Multer), real-time events (Socket.io), error handling, and a production-ready folder structure.

---

## 🚀 Demo
**Live API (status):**  
https://portfolio-showcase-api-1.onrender.com/api/status

---

## 🛠 Tech Stack
- **Node.js**, **TypeScript**
- **Express.js**
- **JWT Authentication**
- **Multer** (file uploads)
- **Socket.io** (real-time events)
- **Database:** MongoDB / MySQL  
- **Testing:** Jest

---

## 📂 Project Structure
```
src/
 ├── controllers/
 ├── middleware/
 ├── models/
 ├── routes/
 ├── utils/
 ├── tests/
 └── index.ts
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Riteshconnect/Portfolio-showCase-Api.git
cd Portfolio-showCase-Api
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Create `.env` File
Copy from `.env.example` and fill the values:

```
PORT=5000
DATABASE_URL=
JWT_SECRET=
CLOUDINARY_URL=
```

### 4️⃣ Run in Development
```bash
npm run dev
```

### 5️⃣ Build & Run in Production
```bash
npm run build
npm start
```
## 📌 Available Scripts
| Script | Description |
|--------|-------------|
| `npm run dev` | Run in development mode |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled app |
| `npm test` | Run Jest tests |

---

## 📡 API Endpoints

### 🔹 Health Check
```
GET /api/status
```

### 🔹 Authentication
```
POST /api/auth/register
POST /api/auth/login
```

### 🔹 Projects
```
GET /api/projects
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id---

## 🧪 Sample API Response (Status)
```json
{
  "status": "running",
  "timestamp": "2025-11-23T10:00:00Z"
}
```
## 📝 Future Improvements
- Add roles & permissions  
- Add email/OTP verification  
- Add Admin Dashboard API  
- Cloud storage provider integration  

---

## 👨‍💻 Author
**Ritesh Kumar**  
Backend Developer – Node.js, Express, TypeScript  
LinkedIn:www.linkedin.com/in/ritesh-kumar-992334232 
GitHub: https://github.com/Riteshconnect

