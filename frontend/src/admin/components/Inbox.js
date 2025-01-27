import React, { useState, useEffect } from 'react';
import { MdCheckCircle, MdAccessTime } from 'react-icons/md';
import useProtectedRequest from '../../hooks/useProtectedRequest';
import '../styles/Inbox.css';

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { makeRequest: fetchMessages } = useProtectedRequest('/api/v1/contacts', 'GET');
  const { makeRequest: updateMessageStatus } = useProtectedRequest('/api/v1/contacts/:id/status', 'PUT');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await fetchMessages();
      console.log('Raw API response:', response);
      // Handle the API response structure
      const messageArray = response?.data || [];
      console.log('Extracted message array:', messageArray);
      console.log('First message _id (if any):', messageArray[0]?._id);
      setMessages(messageArray);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsResponded = async (_id) => {
    try {
      console.log('Attempting to update message with _id:', _id);
      const url = `/api/v1/contacts/${_id}/status`;
      console.log('Making request to:', url);
      const result = await updateMessageStatus({ status: 'responded' }, url);
      console.log('Update response:', result);
      setMessages(messages.map(message => {
        console.log('Comparing message._id:', message._id, 'with _id:', _id);
        return message._id === _id ? { ...message, status: 'responded' } : message;
      }));
    } catch (error) {
      console.error('Failed to update message status:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data
      });
    }
  };

  if (isLoading) {
    return <div className="inbox-container">Loading messages...</div>;
  }

  return (
    <div className="inbox-container">
      <h2>Inbox</h2>
      <div className="messages-list">
        {messages.map((message) => (
          <div key={message._id} className="message-card">
            <div className="message-header">
              <div className="message-info">
                <h3>{message.subject}</h3>
                <div className="status-badge" data-status={message.status}>
                  {message.status === 'awaiting' ? (
                    <><MdAccessTime /> Awaiting Response</>
                  ) : (
                    <><MdCheckCircle /> Responded</>
                  )}
                </div>
              </div>
              {message.status === 'awaiting' && (
                <button 
                  className="respond-button"
                  onClick={() => handleMarkAsResponded(message._id)}
                >
                  Mark as Responded
                </button>
              )}
            </div>
            <div className="message-details">
              <div className="contact-info">
                <p><strong>Name:</strong> {message.name}</p>
                <p><strong>Email:</strong> {message.email}</p>
                <p><strong>Phone:</strong> {message.phoneNumber}</p>
              </div>
              <div className="message-content">
                <p><strong>Message:</strong></p>
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="no-messages">
            <p>No messages found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox; 