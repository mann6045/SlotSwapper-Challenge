import React, { useState, useEffect } from 'react';
import api from '../services/api';

const SwapRequestModal = ({ theirSlot, onClose }) => {
  const [mySwappableSlots, setMySwappableSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMySlots = async () => {
      try {
        setLoading(true);
        const res = await api.get('/events/my-events');
        const swappable = res.data.filter(event => event.status === 'SWAPPABLE');
        setMySwappableSlots(swappable);
      } catch (err) {
        setError('Failed to load your slots.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMySlots();
  }, []);

  const handleSubmitRequest = async () => {
    if (!selectedSlotId) {
      setError('Please select one of your slots to offer.');
      return;
    }
    setError('');
    
    try {
      await api.post('/swaps/request', {
        mySlotId: selectedSlotId,
        theirSlotId: theirSlot._id,
      });
      
      alert('Swap request sent!');
      onClose();
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request.');
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h3>Request Swap</h3>
        <p>You want to trade for:</p>
        <strong>{theirSlot.title}</strong>
        <p>({new Date(theirSlot.startTime).toLocaleString()})</p>
        
        <hr />
        
        <div className="form-group">
          <label htmlFor="offer-slot">Choose one of your swappable slots to offer:</label>
          {loading && <p>Loading your slots...</p>}
          
          {mySwappableSlots.length > 0 ? (
            <select 
              id="offer-slot"
              value={selectedSlotId} 
              onChange={(e) => setSelectedSlotId(e.target.value)}
            >
              <option value="">-- Select your slot --</option>
              {mySwappableSlots.map(slot => (
                <option key={slot._id} value={slot._id}>
                  {slot.title} ({new Date(slot.startTime).toLocaleString()})
                </option>
              ))}
            </select>
          ) : (
            <p>You have no swappable slots to offer.</p>
          )}
        </div>
        
        {error && <p className="error-text">{error}</p>}
        
        <div className="modal-actions">
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button 
            onClick={handleSubmitRequest} 
            className="btn btn-primary"
            disabled={!selectedSlotId || mySwappableSlots.length === 0}
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapRequestModal;