import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events/my-events');
      setMyEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title || !startTime || !endTime) {
      setError('All fields are required.');
      return;
    }
    
    try {
      const res = await api.post('/events', { title, startTime, endTime });
      setMyEvents([...myEvents, res.data]);
      setTitle('');
      setStartTime('');
      setEndTime('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    }
  };

  const handleMakeSwappable = async (eventId, currentStatus) => {
    const newStatus = currentStatus === 'BUSY' ? 'SWAPPABLE' : 'BUSY';
    try {
      const res = await api.patch(`/events/${eventId}/status`, { status: newStatus });
      setMyEvents(myEvents.map(e => (e._id === eventId ? res.data : e)));
    } catch (err) {
       console.error('Failed to update status', err);
       alert('Failed to update status. See console for details.');
    }
  };

  if (loading) return <p>Loading your events...</p>;

  return (
    <div>
      <h2>My Dashboard</h2>

      {/* --- Create Event Form --- */}
      <div className="form-container" style={{ maxWidth: 'none' }}>
        <h3>Create New Event</h3>
        <form onSubmit={handleCreateEvent}>
          {error && <p className="error-text">{error}</p>}
          <div className="form-group">
            <label htmlFor="evt-title">Event Title</label>
            <input
              id="evt-title"
              type="text"
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="evt-start">Start Time</label>
            <input
              id="evt-start"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="evt-end">End Time</label>
            <input
              id="evt-end"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Create Event</button>
        </form>
      </div>

      {/* --- Event List --- */}
      <div className="list-container">
        <h3>My Event List</h3>
        {myEvents.length === 0 ? <p>You have no events. Create one above!</p> : (
          <ul>
            {myEvents.map(event => (
              <li key={event._id} className="list-item">
                <div className="list-item-content">
                  <strong>{event.title}</strong>
                  <small>{new Date(event.startTime).toLocaleString()} to {new Date(event.endTime).toLocaleString()}</small>
                  <br />
                  <span className="status">Status: {event.status}</span>
                </div>
                
                <div className="list-item-actions">
                  {event.status !== 'SWAP_PENDING' && (
                    <button 
                      onClick={() => handleMakeSwappable(event._id, event.status)}
                      className={event.status === 'BUSY' ? "btn btn-secondary" : "btn btn-danger"}
                    >
                      {event.status === 'BUSY' ? 'Make Swappable' : 'Make Busy'}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;