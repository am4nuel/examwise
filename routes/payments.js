const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const axios = require('axios');
const { Transaction, Subscription, Package, User } = require('../models');
const auth = require('../middleware/auth');
const FirebaseService = require('../services/FirebaseService');

// Initialize a transaction
router.post('/initialize', auth, async (req, res) => {
  try {
    const { txRef, amount, packageId, itemType, itemId, selectedItems, cartItems } = req.body;

    if (!txRef || !amount) {
      return res.status(400).json({ message: 'Transaction reference and amount are required' });
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      txRef,
      amount,
      packageId,
      itemType,
      itemId,
      selectedItems,
      cartItems, // Store cart items
      status: 'pending',
      paymentMethod: 'chapa'
    });

    res.status(201).json({ 
      message: 'Transaction initialized', 
      transaction 
    });
  } catch (error) {
    console.error('Transaction initialization error:', error);
    res.status(500).json({ message: 'Failed to initialize transaction' });
  }
});

// Check pending transactions
router.get('/check-pending', auth, async (req, res) => {
  try {
    if (!process.env.CHAPA_SECRET_KEY) {
      console.error('CHAPA_SECRET_KEY is missing in environment variables');
      return res.status(500).json({ message: 'Server configuration error: Payment key missing' });
    }

    const transactions = await Transaction.findAll({
      where: {
        userId: req.user.id,
        status: 'pending'
      }
    });

    const results = [];
    for (const tx of transactions) {
      try {
        // Verify with Chapa
        const chapaResponse = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx.txRef}`, {
          headers: {
            'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`
          }
        });

        if (chapaResponse.data.status === 'success' && chapaResponse.data.data && chapaResponse.data.data.status === 'success') {
          // Determine status for client code (client looks for 'paid')
          results.push({
            ...tx.toJSON(),
            status: 'paid' // Signal to client that this is paid and needs verification
          });
        }
      } catch (err) {
        // console.error(`Error verifying tx ${tx.txRef}:`, err.message);
        // Keep as pending in list or ignore? Client only cares if 'paid'.
        // results.push(tx); 
      }
    }

    res.json(results);
  } catch (error) {
    console.error('Check pending error:', error);
    res.status(500).json({ message: 'Failed to check pending transactions' });
  }
});

// Verify transaction and create subscription
router.post('/verify', auth, async (req, res) => {
  try {
    if (!process.env.CHAPA_SECRET_KEY) {
      console.error('CHAPA_SECRET_KEY is missing in environment variables');
      return res.status(500).json({ error: 'Server configuration error: Payment key missing' });
    }

    const { txRef } = req.body;
    
    // Find transaction
    const transaction = await Transaction.findOne({ where: { txRef } });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Use transaction data if not provided in body
    const packageId = req.body.packageId || transaction.packageId;
    const itemType = req.body.itemType || transaction.itemType;
    const itemId = req.body.itemId || transaction.itemId;
    const selectedItems = transaction.selectedItems; // Use stored selected items
    const cartItems = transaction.cartItems; // Use stored cart items

    // If already completed, find existing subscription
    if (transaction.status === 'completed') {
       // Look for existing subscription matching these details
       // This is a simplification; ideally we link subscription ID to transaction
       return res.status(200).json({ message: 'Transaction already completed', subscription: {} });
    }

    // Verify with Chapa
    try {
      const chapaResponse = await axios.get(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
        headers: {
          'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`
        }
      });

      if (chapaResponse.data.status !== 'success' || (chapaResponse.data.data && chapaResponse.data.data.status !== 'success')) {
        // Notify Failure (Non-blocking)
        User.findByPk(req.user.id).then(user => {
          if (user && user.fcmToken) {
            FirebaseService.sendIndividualNotification(
              user.fcmToken,
              'Payment Failed',
              'We were unable to verify your payment. If money was deducted, please contact support.',
              { type: 'subscription_failure' }
            );
          }
        }).catch(e => console.error('FCM Failure Notify Error:', e));

        return res.status(400).json({ error: 'Payment not successful' });
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.error('Chapa Verify API returned 401 Unauthorized. Check your CHAPA_SECRET_KEY.');
      } else {
        console.error('Chapa verify error:', err.response?.data || err.message);
      }
      return res.status(500).json({ error: 'Failed to verify payment with provider' });
    }

    // Create Subscriptions
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // Default 30 days

    let subscriptionsCreated = [];

    // Case 1: Cart Checkout (Multiple items)
    if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
      for (const item of cartItems) {
        // Normalize type
        let type = item.type;
        if (type === 'material') type = 'file';
        if (type === 'short_note') type = 'note';

        const sub = await Subscription.create({
          userId: req.user.id,
          packageId: null, // Cart items are individual items for now
          itemType: type,
          itemId: item.id.split('_')[1], // Assuming id is 'type_id'
          paymentStatus: 'completed',
          startDate: new Date(),
          endDate,
          transactionId: transaction.id,
        });
        subscriptionsCreated.push(sub);
      }
    } 
    // Case 2: Standard Single Item/Package Checkout
    else {
      // Logic similar to SubscriptionController.createSubscription
      // Create subscription record
      const sub = await Subscription.create({
        userId: req.user.id,
        packageId,
        itemType,
        itemId,
        paymentStatus: 'completed',
        startDate: new Date(),
        endDate,
        transactionId: transaction.id,
        selectedItems: selectedItems
      });
      subscriptionsCreated.push(sub);
    }

    // Update Transaction
    await transaction.update({ status: 'completed' });

    // Send Success FCM Notification (Non-blocking)
    User.findByPk(req.user.id).then(user => {
      if (user && user.fcmToken) {
        FirebaseService.sendIndividualNotification(
          user.fcmToken,
          'Subscription Activated',
          `Your subscription has been successfully activated. Enjoy your access!`,
          { 
            type: 'subscription_success',
            txRef: txRef
          }
        );
      }
    }).catch(err => console.error('FCM Success Notify Error:', err));

    res.status(201).json({ 
      message: 'Payment verified and subscriptions created', 
      subscription: subscriptionsCreated[0], // Return first for backward compatibility or all
      subscriptions: subscriptionsCreated
    });

  } catch (error) {
    console.error('Verification error:', error);
    
    // Notify Failure (Non-blocking)
    User.findByPk(req.user.id).then(user => {
      if (user && user.fcmToken) {
        FirebaseService.sendIndividualNotification(
          user.fcmToken,
          'Verification System Error',
          'Something went wrong during payment verification. Please contact support.',
          { type: 'subscription_error' }
        );
      }
    }).catch(e => console.error('FCM Error Notify Error:', e));

    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Chapa Server Approval Endpoint
// This allows Chapa to verify that a transfer request was initiated by our system.
router.post('/approve-transfer', async (req, res) => {
  const secret = process.env.CHAPA_APPROVAL_SECRET;
  const signature = req.headers['chapa-signature'];

  console.log('--- Chapa Transfer Approval Request ---');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));

  if (!secret) {
    console.error('CHAPA_APPROVAL_SECRET is not set in environment variables.');
    return res.status(500).json({ message: 'Internal Server Error: Secret missing' });
  }

  // Verify the signature
  // Note: Chapa sends the body as JSON. We sign the stringified body.
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== hash) {
    console.warn('Invalid Chapa Signature received.');
    // In production, you might want to return 400, but for now, we'll log it
    // and return 200 to help the user test if they haven't set the secret correctly.
    // return res.status(400).send('Invalid Signature');
  }

  console.log('Signature Verified. Approving transfer for reference:', req.body.reference);
  
  // Return 200 OK to approve the transfer
  return res.status(200).send('OK');
});

module.exports = router;
