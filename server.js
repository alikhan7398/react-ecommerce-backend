const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(cors({ origin: '*' })); // Allow all origins for testing

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url} at ${new Date().toISOString()}`);
  next();
});

// Test GET route
app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.status(200).json({ message: 'Server is running' });
});

// Register POST route
app.post('/api/register', (req, res) => {
  console.log('Register route hit:', req.body);
  res.status(201).json({ message: 'User registered successfully' });
});

// Login POST route with JWT
app.post('/api/login', (req, res) => {
  console.log('Login route hit:', req.body);
  const { username } = req.body;
  const token = jwt.sign({ username, email: `${username}@example.com` }, 'your-secret-key', { expiresIn: '1h' });
  res.status(200).json({
    message: 'Login successful',
    token: token,
    user: { username }
  });
});

// Checkout POST route with JWT validation
app.post('/api/checkout', (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    console.log('Missing token');
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'your-secret-key');
    console.log('Decoded token:', decoded);
    const orderData = req.body;
    console.log('Checkout route hit. Order data received:', orderData);
    res.status(200).json({ message: 'Checkout successful', order: orderData });
  } catch (error) {
    console.log('Invalid token:', error.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
});

// Catch-all route (must come LAST)
app.use('*', (req, res) => {
  console.log('Catch-all route hit:', req.url);
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('Failed to start server:', err);
  } else {
    console.log(`Server running on port ${PORT}`);
    console.log('Listening on all interfaces');
  }
});

// Error logging
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});