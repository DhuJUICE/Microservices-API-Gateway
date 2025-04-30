const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // Import Axios

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Make a GET request to the Spring Boot microservice to fetch user by username
        const response = await axios.get(`http://127.0.0.1:8080/api/users/username/${username}`);

        const user = response.data; // The user returned by Spring Boot
        const userRole = user.role;
        const userName = user.username;

        // Check if the user exists and the password matches
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Incorrect Password - Try Again' });
        }

        // Create JWT token if credentials are valid
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, "role": userRole, "username": userName});
    } catch (error) {
        // Handle errors (e.g., user not found, microservice unreachable)
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'User not found' });
        } else {
            return res.status(500).json({ error: 'An error occurred while communicating with the user service' });
        }
    }
});

module.exports = router;
