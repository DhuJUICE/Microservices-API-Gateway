const express = require('express'); //need to npm install express
const cors = require('cors'); //need to npm install cors

//include the route files to be used
const authRoutes = require('./routes/auth');
const atmRoutes = require('./routes/atm');

require('dotenv').config(); //need to npm install dotenv

const app = express();
app.use(cors());
app.use(express.json());

//Define the actual url Routes to my routes files
app.use('/auth', authRoutes);
app.use('/atm', atmRoutes);

app.listen(3000, () => console.log('API Gateway running on port 3000'));
