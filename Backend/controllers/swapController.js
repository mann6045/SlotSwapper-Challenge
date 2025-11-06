const SwapRequest = require('../models/SwapRequest');
const Event = require('../models/Event');

// @desc    Get all slots marked as SWAPPABLE (excluding user's own)
// @route   GET /api/swaps/swappable-slots
exports.getSwappableSlots = async (req, res) => {
  try {
    const swappableSlots = await Event.find({
      status: 'SWAPPABLE',
      owner: { $ne: req.user.id }, // $ne = Not Equal
    }).populate('owner', 'name email'); // Populate owner info, exclude password

    res.json(swappableSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new swap request
// @route   POST /api/swaps/request
exports.requestSwap = async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  const requesterId = req.user.id;

  try {
    const mySlot = await Event.findById(mySlotId);
    const theirSlot = await Event.findById(theirSlotId);

    // --- Validation ---
    if (!mySlot || !theirSlot) {
      return res.status(404).json({ message: 'One or both slots not found' });
    }
    if (mySlot.owner.toString() !== requesterId) {
      return res.status(401).json({ message: 'Not authorized to swap this slot' });
    }
    if (theirSlot.owner.toString() === requesterId) {
      return res.status(400).json({ message: 'Cannot swap with yourself' });
    }
    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ message: 'One or both slots are not swappable' });
    }
    // --- End Validation ---

    // 1. Create the SwapRequest
    const swapRequest = new SwapRequest({
      requester: requesterId,
      responder: theirSlot.owner,
      requesterSlot: mySlotId,
      responderSlot: theirSlotId,
      status: 'PENDING',
    });
    await swapRequest.save();

    // 2. Update both slots to SWAP_PENDING
    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save();
    await theirSlot.save();

    res.status(201).json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Respond to an incoming swap request (Accept/Reject)
// @route   POST /api/swaps/respond/:requestId
exports.respondToSwap = async (req, res) => {
  const { requestId } = req.params;
  const { accept } = req.body; // true or false
  const responderId = req.user.id;

  try {
    const swapRequest = await SwapRequest.findById(requestId);

    // --- Validation ---
    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }
    if (swapRequest.responder.toString() !== responderId) {
      return res.status(401).json({ message: 'Not authorized to respond to this request' });
    }
    if (swapRequest.status !== 'PENDING') {
      return res.status(400).json({ message: 'This request has already been actioned' });
    }
    // --- End Validation ---

    if (accept === false) {
      // --- REJECT LOGIC ---
      swapRequest.status = 'REJECTED';
      await swapRequest.save();

      // Set both slots back to SWAPPABLE
      await Event.findByIdAndUpdate(swapRequest.requesterSlot, { status: 'SWAPPABLE' });
      await Event.findByIdAndUpdate(swapRequest.responderSlot, { status: 'SWAPPABLE' });

      return res.json({ message: 'Swap rejected' });
    }

    // --- ACCEPT LOGIC (The Transaction) ---
    swapRequest.status = 'ACCEPTED';
    
    // 1. Get original owners
    const requesterOwner = swapRequest.requester;
    const responderOwner = swapRequest.responder;

    // 2. Find and update slots
    // Requester's slot (mySlot) now belongs to the responder
    await Event.findByIdAndUpdate(swapRequest.requesterSlot, {
      owner: responderOwner,
      status: 'BUSY',
    });
    
    // Responder's slot (theirSlot) now belongs to the requester
    await Event.findByIdAndUpdate(swapRequest.responderSlot, {
      owner: requesterOwner,
      status: 'BUSY',
    });
    
    // 3. Save the finalized swap request
    await swapRequest.save();

    // **BONUS**: You should also find and REJECT all other PENDING
    // requests that involve either of these two slots, as they are now off the market.
    // (This is a key piece of logic for a robust system)
    await SwapRequest.updateMany(
      { status: 'PENDING', 
        $or: [
          { requesterSlot: swapRequest.requesterSlot },
          { responderSlot: swapRequest.requesterSlot },
          { requesterSlot: swapRequest.responderSlot },
          { responderSlot: swapRequest.responderSlot },
        ]
      },
      { status: 'REJECTED' }
    );
    // Also, find the events associated with those newly rejected requests
    // and set their status back to 'SWAPPABLE'. (This part can get complex,
    // but the above is a good start).

    res.json({ message: 'Swap accepted and calendars updated!' });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's incoming swap requests
// @route   GET /api/swaps/incoming
exports.getIncomingRequests = async (req, res) => {
   try {
    const requests = await SwapRequest.find({
      responder: req.user.id,
      status: 'PENDING',
    })
    .populate('requester', 'name')
    .populate('requesterSlot')
    .populate('responderSlot');
    res.json(requests);
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's outgoing swap requests
// @route   GET /api/swaps/outgoing
exports.getOutgoingRequests = async (req, res) => {
   try {
    const requests = await SwapRequest.find({
      requester: req.user.id,
      status: 'PENDING',
    })
    .populate('responder', 'name')
    .populate('requesterSlot')
    .populate('responderSlot');
    res.json(requests);
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
};