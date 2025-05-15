// monitoring.js
const fs = require('fs');
const path = require('path');
const client = require('prom-client');

const register = new client.Registry();

// Collect default system metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Create HTTP request counter
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(httpRequestCounter);

// Middleware to count requests
function metricsMiddleware(req, res, next) {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode,
    });
  });
  next();
}

// Function to write metrics to a log file every minute
function startMetricsLogging() {
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const logFile = path.join(logDir, 'monitor.log');

  setInterval(async () => {
    try {
      const metrics = await register.metrics();
      const timestamp = new Date().toISOString();
      const logEntry = `\n[${timestamp}]\n${metrics}\n`;
      fs.appendFile(logFile, logEntry, err => {
        if (err) {
          console.error('Error writing metrics to file:', err);
        }
      });
    } catch (err) {
      console.error('Error collecting metrics:', err);
    }
  }, 30 * 1000); // every 60 seconds
}

// Expose the register and middleware for use in app.js
module.exports = {
  register,
  metricsMiddleware,
  startMetricsLogging,
};
