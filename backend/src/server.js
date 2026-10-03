const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/posts/:postId/comments', require('./routes/commentRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BlogNest API is running smoothly' });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`BlogNest Server running on port ${PORT}`);
});
