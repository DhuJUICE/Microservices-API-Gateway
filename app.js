const express = require('express');
const cors = require('cors');

//include the route files to be used
const authRoutes = require('./routes/auth');
const atmRoutes = require('./routes/atm');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

//Define the actual url Routes to my routes files
app.use('/auth', authRoutes);
app.use('/atm', atmRoutes);

/*
// Protected route example
app.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'You have access', user: req.user });
});


// JWT middleware
const jwt = require('jsonwebtoken');
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ error: 'Invalid token' });
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ error: 'No token provided' });
    }
}

*/
app.listen(3000, () => console.log('API Gateway running on port 3000'));
