const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config();

// Debug environment variables
console.log('Environment Variables:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not Set');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Not Set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not Set');

// Set up Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Routes - Only load if database connection is successful
let authRoutes, userRoutes, contactRoutes;
try {
  authRoutes = require('./src/routes/auth');
  userRoutes = require('./src/routes/users');
  contactRoutes = require('./src/routes/contact');
  
  // API routes - only set up if routes were successfully loaded
  if (authRoutes) app.use('/api/auth', authRoutes);
  if (userRoutes) app.use('/api/users', userRoutes);
  if (contactRoutes) app.use('/api/contact', contactRoutes);
} catch (error) {
  console.log('Routes loading error:', error);
  console.log('API routes will not be available');
}

// Set up basic API fallbacks for critical routes
app.post('/api/contact/send', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.status(200).json({ success: true, message: 'Message received (static response)' });
});

// Serve HTML routes - these work without database
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Handle direct access to index.html, redirect to home
app.get('/index', (req, res) => {
  res.redirect('/');
});

app.get('/index.html', (req, res) => {
  res.redirect('/');
});

// Catch-all route to handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for ReferralTrack, an AI-powered referral platform. You help users understand our referral program features, pricing, and how to get started. Keep responses concise and friendly."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your request.',
      details: error.message 
    });
  }
});

// Try to connect to MongoDB but don't let it block the app startup
let dbConnected = false;

// Start server first to ensure the app is available even without DB
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
  console.log('OpenAI API Key configured:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');
});

// Then try to connect to MongoDB
try {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/creative-website-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Reduce timeout to 5 seconds
  })
  .then(() => {
    console.log('MongoDB connected successfully');
    dbConnected = true;
  })
  .catch(err => {
    console.log('MongoDB connection error:', err);
    console.log('Continuing without MongoDB connection - limited functionality available');
    console.log('Static pages and basic features will work normally');
  });
} catch (error) {
  console.log('MongoDB connection attempt error:', error);
  console.log('Continuing without MongoDB connection - limited functionality available');
  console.log('Static pages and basic features will work normally');
} 
