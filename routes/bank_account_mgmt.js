// bank_account_mgmt.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const authenticateJWT = require('../middleware/authenticateJWT'); // import middleware

// POST - Fetch all bank account details
router.post('/details', authenticateJWT, async (req, res) => {
    try {
        const response = await axios.get('http://127.0.0.1:8080/api/financials');
        const financialData = response.data;

        res.status(200).json({ message: 'Financial data retrieved successfully', data: financialData });
    } catch (error) {
        console.error('Error fetching financial data:', error.message);
        res.status(500).json({ error: 'Failed to fetch financial data' });
    }
});

// POST - Delete a bank account and associated user by ID
router.post('/delete', authenticateJWT, async (req, res) => {
    const { bankAccountId, userId } = req.body;

    if (!bankAccountId) {
        return res.status(400).json({ error: 'bankAccountId is required' });
    }

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`Deleting user with ID: ${userId}`);
    console.log(`Deleting bank account with ID: ${bankAccountId}`);



    // Step 1: Delete the bank account
    try {
        await axios.delete(`http://127.0.0.1:8080/api/financials/${bankAccountId}`);
        console.log(`Bank account ${bankAccountId} deleted successfully`);
        res.status(200).json({ message: `Bank account ${bankAccountId} and user ${userId} deleted successfully` });
    } catch (error) {
        console.error(`Error deleting bank account ${bankAccountId}:`, error.message);
        res.status(500).json({ error: `User deleted but failed to delete bank account ${bankAccountId}` });
    }

	// Step 2: Delete the user
	try {
		await axios.delete(`http://127.0.0.1:8080/api/users/${userId}`);
		console.log(`User ${userId} deleted successfully`);
	} catch (error) {
		console.error(`Error deleting user ${userId}:`, error.message);
		return res.status(500).json({ error: `Failed to delete user ${userId}` });
	}
});

module.exports = router;
