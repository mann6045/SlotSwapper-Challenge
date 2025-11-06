import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Requests = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [incomingRes, outgoingRes] = await Promise.all([
        api.get('/swaps/incoming'),
        api.get('/swaps/outgoing')
      ]);
      setIncoming(incomingRes.data);
      setOutgoing(outgoingRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const handleResponse = async (requestId, accept) => {
    try {
      await api.post(`/swaps/respond/${requestId}`, { accept });
      fetchData(); 
    } catch (err) {
      console.error('Failed to respond to swap', err);
    }
  };

  if (loading) return <p>Loading requests...</p>;

  return (
    <div>
      <h2>My Swap Requests</h2>
      
      <div className="list-container" style={{ marginBottom: '30px' }}>
        <h3>Incoming Requests</h3>
        {incoming.length === 0 ? <p>No incoming requests.</p> : (
          <ul>
            {incoming.map(req => (
              <li key={req._id} className="list-item">
                <div className="list-item-content">
                  <p>
                    <strong>{req.requester.name}</strong> wants to trade their 
                    "<strong>{req.requesterSlot.title}</strong>" for your 
                    "<strong>{req.responderSlot.title}</strong>".
                  </p>
                </div>
                <div className="list-item-actions">
                  <button onClick={() => handleResponse(req._id, true)} className="btn btn-success">Accept</button>
                  <button onClick={() => handleResponse(req._id, false)} className="btn btn-danger">Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="list-container">
        <h3>Outgoing Requests (Pending)</h3>
        {outgoing.length === 0 ? <p>No outgoing requests.</p> : (
          <ul>
            {outgoing.map(req => (
              <li key={req._id} className="list-item">
                <div className="list-item-content">
                  <p>
                    You offered your "<strong>{req.requesterSlot.title}</strong>" 
                    for <strong>{req.responder.name}</strong>'s 
                    "<strong>{req.responderSlot.title}</strong>".
                  </p>
                  <span className="status">Status: {req.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Requests;