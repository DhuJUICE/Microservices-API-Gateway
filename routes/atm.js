const express = require('express');
const axios = require('axios');
const router = express.Router();

const authenticateJWT = require('../middleware/authenticateJWT'); // import middleware

// POST - Update bank balance
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

// GET - Fetch user financial data
router.get('/transaction/:userId', authenticateJWT, async (req, res) => {
  const { userId } = req.params;

  try {
    const response = await axios.get(`http://127.0.0.1:8080/api/financials/user/${userId}`);
    
    // Log the entire response data to check its structure
    console.log('Response data from backend:', response.data);

    // Extract the bankBalance from the response data
    const bankBalance = response.data?.[0]?.bankBalance;

    // Check if bankBalance exists and is a valid number
    if (bankBalance !== undefined && !isNaN(bankBalance)) {
      console.log(`Bank balance for user ${userId}: R${bankBalance}`);
      res.status(200).json({ bankBalance });  // Send only bankBalance back
    } else {
      res.status(404).json({ error: 'Bank balance not found' });  // Handle case where bankBalance is not available
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch financial data' });
  }
});



module.exports = router;

