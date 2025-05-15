const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const atmRoutes = require('./routes/atm');
const logger = require('./middleware/logger');

require('dotenv').config();

const { register, metricsMiddleware, startMetricsLogging } = require('./middleware/monitoring');

const app = express();
app.use(cors());
app.use(express.json());

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
