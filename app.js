const express = require('express'); //need to npm install express
const cors = require('cors'); //need to npm install cors

//include the route files to be used
const authRoutes = require('./routes/auth');
const atmRoutes = require('./routes/atm');
const logger = require('./middleware/logger');

//const bankAccountRoutes = require('./routes/bank_account_mgmt');

require('dotenv').config(); //need to npm install dotenv

const app = express();
app.use(cors());
app.use(express.json());

//log all requests coming to the api gateway
app.use((req, res, next) => {
	logger.info(`${req.method} ${req.url}`);
	next();
});

//Define the actual url Routes to my routes files
app.use('/auth', authRoutes);
app.use('/atm', atmRoutes);
//app.use('/bank-account', bankAccountRoutes);

//log all errors
app.use((err, req, res, next) => {
	logger.error(`Error: ${err.message}`);
	res.status(500).json({error : "Something went wrong on the server"});
});

app.listen(3000, () => console.log('API Gateway running on port 3000'));
