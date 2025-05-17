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


// POST - Create a new bank account
router.post('/create', authenticateJWT, async (req, res) => {
    const { username, password, bankBalance, bankName, bankAccountNumber, role} = req.body;

    let user = null;
    let bankAccountDetails = null;

    // Validate request body
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }


    //Validate bank details
    if(!bankName || !bankAccountNumber){
        return res.status(400).json({ error: 'Bank name, and bankAccountNumber are required' });
    }

    //create user in USER Table
    try {
        const response = await axios.post('http://127.0.0.1:8080/api/users', {
            username,
            password,
            role
        });

        //store user object to be used by financial bankAccountDetails
        user = response.data;

    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ error: 'Failed to create user' });
    }

    //create bank account financial data in FINANCIAL Table
    try {
        const response = await axios.post('http://127.0.0.1:8080/api/financials', {
            bankBalance,
            bankAccountNumber,
            bankName,
            user
        });

        bankAccountDetails = response.data;

        res.status(201).json({ message: 'Bank Account Details created successfully', data: bankAccountDetails });
    } catch (error) {
        console.error('Error creating Bank Account Details:', error.message);
        res.status(500).json({ error: 'Failed to create Bank Account Details' });
    }
});

// POST - Update user's password and bank details bank's name
router.post('/update', authenticateJWT, async (req, res) => {
    const { userId, bankAccountId, password, bankName, oldUsername, oldBankBalance, oldBankAccountNumber, oldUser} = req.body;

    try {
		if(password){
			// Update user password
			await axios.put(`http://127.0.0.1:8080/api/users/${userId}`, { "password":password, "username":oldUsername, "role": oldUser.role});
			console.log(`User ${userId} password updated`);
		}
		
		if(bankName){
			// Update bank account name
			await axios.put(`http://127.0.0.1:8080/api/financials/${bankAccountId}`, { "bankName":bankName, "bankBalance":oldBankBalance, "bankAccountNumber":oldBankAccountNumber, "user":oldUser});
			console.log(`Bank account ${bankAccountId} bankName updated`);
		}
		
        
        res.status(200).json({ message: 'Bank Account updated successfully' });

    } catch (error) {
        console.error('Error updating data:', error.message);
        res.status(500).json({ error: 'Failed to update user or bank account' });
    }
});

module.exports = router;
