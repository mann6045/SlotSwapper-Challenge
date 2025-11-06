const Event = require('../models/Event');

// @desc    Create new event
// @route   POST /api/events
exports.createEvent = async (req, res) => {
  const { title, startTime, endTime } = req.body;
  try {
    const event = new Event({
      title,
      startTime,
      endTime,
      owner: req.user.id, // from 'protect' middleware
      status: 'BUSY',
    });
    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's events
// @route   GET /api/events/my-events
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ owner: req.user.id }).sort({ startTime: 'asc' });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event status (e.g., BUSY -> SWAPPABLE)
// @route   PATCH /api/events/:id/status
exports.updateEventStatus = async (req, res) => {
  const { status } = req.body; // e.g., { "status": "SWAPPABLE" }

  // Simple validation for allowed statuses
  if (!['BUSY', 'SWAPPABLE'].includes(status)) {
     return res.status(400).json({ message: 'Invalid status update' });
  }

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user owns this event
    if (event.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Check if event is already in a pending swap
    if (event.status === 'SWAP_PENDING') {
       return res.status(400).json({ message: 'Cannot change status of a pending swap' });
    }

    event.status = status;
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
   try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    // You might want to prevent deletion if status is SWAP_PENDING
    if (event.status === 'SWAP_PENDING') {
       return res.status(400).json({ message: 'Cannot delete event with pending swap' });
    }

    await event.deleteOne(); // Use deleteOne() Mongoose method
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};