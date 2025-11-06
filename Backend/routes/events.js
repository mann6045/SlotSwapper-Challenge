const express = require('express');
const router = express.Router();
const {
  createEvent,
  getMyEvents,
  updateEventStatus,
  deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// All event routes are protected
router.use(protect);

router.route('/').post(createEvent);
router.route('/my-events').get(getMyEvents);
router.route('/:id/status').patch(updateEventStatus); // For 'Make Swappable'
router.route('/:id').delete(deleteEvent);

module.exports = router;