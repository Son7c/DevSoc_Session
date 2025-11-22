// Vercel serverless function wrapper for Express app
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from '../server/src/utils/db.js';
import { envKeys } from '../server/src/utils/envKeys.js';
import authRoutes from '../server/src/routes/authRoutes.js';
import postRoutes from '../server/src/routes/postRoutes.js';
import aiRoutes from '../server/src/routes/aiRoutes.js';

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: envKeys.CLIENT_URL,
    credentials: true,
  })
);

// Routes
app.use('/api/v1/users', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

// Connect to MongoDB (reuse connections)
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await connectDB(envKeys.MONGO_URI);
  } catch (err) {
    console.error('MongoDB connect error:', err);
    throw err;
  }
};

// Serverless function handler
export default async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({
      message: 'Database connection failed',
      error: error.message,
    });
  }
};
