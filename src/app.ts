import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

// --- DATABASE IMPORTS ---
import connectDB from './config/db';
import { connectMySQL } from './config/dbMysql';
import Contact from './models/contactModel';
import { verifyEmailConnection } from './config/nodeMailer';

// --- ROUTE IMPORTS ---
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import experienceRoutes from './routes/experienceRoutes';
import skillRoutes from './routes/skillRoutes';
import contactRoutes from './routes/contactRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swaggerConfig';
import { errorHandler } from './middleware/errorMiddleware';

// Load environment variables (MUST BE AT THE TOP)
dotenv.config();

// --- !! Safety Check !! ---
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}

// --- CONNECT TO DATABASES & SERVICES ---
// if (process.env.NODE_ENV !== 'test') {
//   connectDB();
//   connectMySQL();
//   verifyEmailConnection();
// }

// --- APP & SERVER SETUP ---
const app: Express = express();
const httpServer = createServer(app); // We will export this
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contact', contactRoutes);

// === Test Route ===
app.get('/', (req: Request, res: Response) => {
  res.send('API is running... 🚀');
});

// --- SOCKET.IO ---
io.on('connection', (socket) => {
  console.log(`[socket.io]: Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[socket.io]: Client disconnected: ${socket.id}`);
  });
});

// --- ERROR HANDLER ---
app.use(errorHandler);

// --- SYNC DB & EXPORT ---
// We'll sync the DB here but NOT listen
export const syncMySQL = async () => {
  try {
    await Contact.sync();
    console.log('[database]: MySQL "Contacts" table synced successfully.');
  } catch (error) {
    console.error('[database]: Failed to sync MySQL tables:', error);
  }
};

export { app, httpServer }; // Export the server for testing