import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http'; // 1. Import createServer
import { Server } from 'socket.io';

import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import projectRoutes from './routes/projectRoutes'; 
import experienceRoutes from './routes/experienceRoutes';
import skillRoutes from './routes/skillRoutes';
import {errorHandler} from "./middleware/errorMiddleware"
import path from 'path';

dotenv.config()
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1); // Exit the app
}

connectDB();

// Initialize Express app
const app: Express = express();
const PORT: string | number = process.env.PORT || 5001; // Use a new port like 5001

// === Middlewares ===
// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use("/api/users" , authRoutes);
app.use('/api/projects', projectRoutes); // <-- 2. USE IT
app.use('/api/experience', experienceRoutes); // <-- 2. USE IT
app.use('/api/skills', skillRoutes); // <-- 2. USE IT

// === Test Route ===
// A simple GET route to make sure our server is alive
app.get('/', (req: Request, res: Response) => {
  res.send('API is running... 🚀');
});

app.use(errorHandler)
// 3. Create HTTP server and Socket.io server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // WARNING: Be more specific in production!
    methods: ['GET', 'POST'],
  },
});

// 4. Set up Socket.io connection listener
io.on('connection', (socket) => {
  console.log(`[socket.io]: Client connected: ${socket.id}`);

  socket.emit('welcome', {
    message: `Welcome! You are connected with ID: ${socket.id}`,
  });

  // --- 2. Broadcast Event (emits to everyone *except* the new client) ---
  socket.broadcast.emit('new-user', {
    message: `A new user just connected: ${socket.id}`,
  });
  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log(`[socket.io]: Client disconnected: ${socket.id}`);
    io.emit('user-disconnected', {
      message: `User disconnected: ${socket.id}`,
    });
  });
});
// === Start Server ===
httpServer.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});