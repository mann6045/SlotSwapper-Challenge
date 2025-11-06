const express = require('express');
const router = express.Router();
const {
  getSwappableSlots,
  requestSwap,
  respondToSwap,
  getIncomingRequests,
  getOutgoingRequests
} = require('../controllers/swapController');
const { protect } = require('../middleware/authMiddleware');

// All swap routes are protected
router.use(protect);

// GET /api/swaps/swappable-slots
router.get('/swappable-slots', getSwappableSlots);

// POST /api/swaps/request
router.post('/request', requestSwap);

// POST /api/swaps/respond/:requestId
router.post('/respond/:requestId', respondToSwap);

// GET /api/swaps/incoming (For the 'Notifications' page)
router.get('/incoming', getIncomingRequests);

// GET /api/swaps/outgoing (For the 'Notifications' page)
router.get('/outgoing', getOutgoingRequests);

module.exports = router;