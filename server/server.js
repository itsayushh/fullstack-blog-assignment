import express from 'express';
import mongoose from 'mongoose';    
import cors from 'cors';
import dotenv from 'dotenv';
import blogRoutes from './routes/blog.js';
import authRoutes from './routes/auth.js';
import errorHandler from './middleware/errorHandler.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogplatform')
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));


app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/hello', (req, res) => {
  res.status(200).json({ 
    message: 'Blog Platform API is running!', 
    timestamp: new Date().toISOString() 
  });
});

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API Health Check: http://localhost:${PORT}/api/hello`);
});