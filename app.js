const express = require('express'); //need to npm install express
const cors = require('cors'); //need to npm install cors
const rateLimit = require('express-rate-limit'); //need to npm install express-rate-limit

const authRoutes = require('./routes/auth');
const atmRoutes = require('./routes/atm');
const logger = require('./middleware/logger');
const bankAccountRoute = require('./routes/bank_account_mgmt');

require('dotenv').config(); //need to npm install dotenv

const { register, metricsMiddleware, startMetricsLogging } = require('./middleware/monitoring');

const app = express();
app.use(cors());
app.use(express.json());

//Rate Limiter - 100 requests/15minutes/IP
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//Apply global rate limiter to all requests
app.use(rateLimiter);

// Logging all requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Use Prometheus metrics middleware to count requests
app.use(metricsMiddleware);

// Define routes
app.use('/auth', authRoutes);
app.use('/atm', atmRoutes);
app.use('/bank-account', bankAccountRoute);

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Log all errors
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ error: "Something went wrong on the server" });
});

// Start metrics logging to file every minute
startMetricsLogging();

app.listen(3000, () => console.log('API Gateway running on port 3000'));
