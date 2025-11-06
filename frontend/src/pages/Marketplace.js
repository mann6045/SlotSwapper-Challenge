import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SwapRequestModal from '../components/SwapRequestModal';

const Marketplace = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await api.get('/swaps/swappable-slots');
      setAvailableSlots(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only refetch if modal is closed
    if (!isModalOpen) {
      fetchSlots();
    }
  }, [isModalOpen]);

  const handleRequestClick = (slot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  if (loading) return <p>Loading available slots...</p>;

  return (
    <div>
      <h2>Slot Marketplace</h2>
      
      <div className="list-container">
        {availableSlots.length === 0 ? <p>No swappable slots available right now.</p> : (
          <ul>
            {availableSlots.map(slot => (
              <li key={slot._id} className="list-item">
                <div className="list-item-content">
                  <strong>{slot.title}</strong>
                  <small>Owner: {slot.owner.name}</small>
                  <br />
                  <small>Time: {new Date(slot.startTime).toLocaleString()}</small>
                </div>
                <div className="list-item-actions">
                  <button 
                    onClick={() => handleRequestClick(slot)}
                    className="btn btn-primary"
                  >
                    Request Swap
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {isModalOpen && (
        <SwapRequestModal 
          theirSlot={selectedSlot} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default Marketplace;