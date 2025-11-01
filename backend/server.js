import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables FIRST before importing routes
dotenv.config();

// Import routes (AFTER dotenv.config())
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

// Middleware
app.use(cors()); // Allow frontend to connect
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies with increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Lolipop Wear API',
    status: 'Server is running',
    endpoints: {
      products: '/api/products',
      users: '/api/users',
      orders: '/api/orders'
    }
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});
