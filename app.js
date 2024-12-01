// // app.js
// Import the tracing setup first to ensure tracing starts before anything else
require('./tracing');  // This will initialize OpenTelemetry tracing
const { context, trace } = require('@opentelemetry/api');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const connectDB = require('./db');
const User = require('./models/User');

const pino = require('pino');

// Create a Pino logger instance
const logger = pino({
  level: 'info', // Set the default log level
  transport: {
    target: 'pino-pretty', // Pretty print for local development
    options: {
      colorize: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss'
    }
  }
});

// // Create Pino logger instance with production-friendly settings
// const logger = pino({
//     level: 'info', // Default log level
//     // No pretty printing in production (logs in JSON format)
//     transport: process.env.NODE_ENV === 'production' ? undefined : {
//       target: 'pino-pretty', // Pretty print logs in development only
//       options: {
//         colorize: true,
//         translateTime: 'yyyy-mm-dd HH:MM:ss',
//         ignore: 'pid,hostname',
//       },
//     },
//   });




const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false,
}));

// Set view engine
app.set('view engine', 'ejs');

// Routes
// Homepage (Login page)
app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.render('login');
});

// Register page
app.get('/register', (req, res) => {
  res.render('register');
});

// Register route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
//   console.log('Registering user:', username);  // Log registration attempt
  logger.info(`Registering user: ${username}`);    // Log registration attempt
  try {
    const user = await User.create({ username, password });
    // console.log('User registered successfully:', username);  // Log successful registration
    logger.info(`User registered successfully: ${username}`);  // Log successful registrati
    res.redirect('/');
  } catch (err) {
    logger.error(`Error during registration: ${err.message}`);  // Log errors
    res.status(500).send('Error registering user');
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  logger.info(`Login attempt for username: ${username}`);  // Log login attempt

  try {
    const user = await User.findOne({ username });
    if (user && await user.matchPassword(password)) {
      logger.info(`Login successful for user:  ${username}`);  // Log successful login
      req.session.userId = user._id;
      res.redirect('/dashboard');
    } else {
      logger.warn(`Invalid credentials for user: ${username}`);  // Log invalid login attempt
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    logger.error(`Error during login: ${err.message}`);  // err);  // Log errors
    res.status(500).send('Error logging in');
  }
});

// Dashboard page
app.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }

  logger.info(`Accessing dashboard for user ID: ${req.session.userId}`);  // Log dashboard access
  res.send('Welcome to your dashboard');
});


// Start server
app.listen(3000, () => {
  logger.info('Server started on http://localhost:3000');
});



// // Import the tracing setup first to ensure tracing starts before anything else
// require('./tracing');  // This will initialize OpenTelemetry tracing

// const express = require('express');
// const mongoose = require('mongoose');
// const session = require('express-session');
// const connectDB = require('./db');
// const User = require('./models/User');
// const pino = require('pino');

// // // Create a Pino logger instance
// // const logger = pino({
// //   level: 'info', // Set the default log level
// //   transport: {
// //     target: 'pino-pretty', // Pretty print for local development
// //     options: {
// //       colorize: true,
// //       translateTime: 'yyyy-mm-dd HH:MM:ss'
// //     }
// //   }
// // });

// // Create Pino logger instance with production-friendly settings
// const logger = pino({
//     level: 'info', // Default log level
//     // No pretty printing in production (logs in JSON format)
//     transport: process.env.NODE_ENV === 'production' ? undefined : {
//       target: 'pino-pretty', // Pretty print logs in development only
//       options: {
//         colorize: true,
//         translateTime: 'yyyy-mm-dd HH:MM:ss',
//         ignore: 'pid,hostname',
//       },
//     },
//   });

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(session({
//   secret: 'secretkey',
//   resave: false,
//   saveUninitialized: false,
// }));

// // Set view engine
// app.set('view engine', 'ejs');

// // Routes
// // Homepage (Login page)
// app.get('/', (req, res) => {
//   if (req.session.userId) {
//     return res.redirect('/dashboard');
//   }
//   res.render('login');
// });

// // Register page
// app.get('/register', (req, res) => {
//   res.render('register');
// });

// // Register route
// app.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//   logger.info(`Registering user: ${username}`);  // Log registration attempt
//   try {
//     const user = await User.create({ username, password });
//     logger.info(`User registered successfully: ${username}`);  // Log successful registration
//     res.redirect('/');
//   } catch (err) {
//     logger.error(`Error during registration: ${err.message}`);  // Log error during registration
//     res.status(500).send('Error registering user');
//   }
// });

// // Login route
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   logger.info(`Login attempt for username: ${username}`);  // Log login attempt

//   try {
//     const user = await User.findOne({ username });
//     if (user && await user.matchPassword(password)) {
//       logger.info(`Login successful for user: ${username}`);  // Log successful login
//       req.session.userId = user._id;
//       res.redirect('/dashboard');
//     } else {
//       logger.warn(`Invalid credentials for user: ${username}`);  // Log invalid login attempt
//       res.status(401).send('Invalid credentials');
//     }
//   } catch (err) {
//     logger.error(`Error during login: ${err.message}`);  // Log errors
//     res.status(500).send('Error logging in');
//   }
// });

// // Dashboard page
// app.get('/dashboard', (req, res) => {
//   if (!req.session.userId) {
//     return res.redirect('/');
//   }

//   logger.info(`Accessing dashboard for user ID: ${req.session.userId}`);  // Log dashboard access
//   res.send('Welcome to your dashboard');
// });

// // Start server
// app.listen(3000, () => {
//   logger.info('Server started on http://localhost:3000');  // Log server start
// });


