// EventDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch('/events.json');
        const events = await response.json();
        const foundEvent = events.find(e => e.id === parseInt(id));
        setEvent(foundEvent);
      } catch (error) {
        setError('Error fetching event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>Category: {event.category}</p>
      <p>Date: {event.date}</p>
      <p>Available Seats: {event.availableSeats}</p>
      <p>Price: ${event.price}</p>
    </div>
  );
};

export default EventDetail;
