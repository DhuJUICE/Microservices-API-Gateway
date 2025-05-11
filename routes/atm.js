// routes/atm.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const authenticateJWT = require('../middleware/authenticateJWT'); // import from middleware

// ATM transaction route
router.post('/transaction/:userId', authenticateJWT, async (req, res) => {
    const { userId } = req.params;
    const { bankBalance } = req.body;

    try {
        const response = await axios.put(
            `http://127.0.0.1:8080/api/financials/user/${userId}`,
            { bankBalance }
        );

        res.status(200).json({ message: 'Bank balance updated successfully', data: response.data });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to update bank balance' });
    }
});

module.exports = router;
