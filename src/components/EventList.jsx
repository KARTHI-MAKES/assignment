import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ITEMS_PER_PAGE = 5;

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch('/events.json'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = [...new Set(events.map(event => event.category)), 'All'];

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, categoryFilter]);

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEvents, currentPage]);

  const handleBooking = (id) => {
    if (!user) {
      alert('You must be logged in to book a ticket.');
      return;
    }
    setEvents(prevEvents =>
      prevEvents.map(event => {
        if (event.id === id) {
          if (event.availableSeats > 0) {
            alert(`Booked 1 ticket for ${event.title}`);
            return { ...event, availableSeats: event.availableSeats - 1 };
          } else {
            alert('No seats available for this event.');
            return event;
          }
        }
        return event;
      })
    );
  };

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>Error fetching events: {error}</p>;
  }

  return (
    <div>
      <h2>Available Events</h2>
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
        {categories.map((category, index) => (
          <option key={index} value={category}>{category}</option>
        ))}
      </select>
      
      {paginatedEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        paginatedEvents.map((event) => (
          <div key={event.id} className="event">
            <h3>
              <Link to={`/event/${event.id}`}>{event.title}</Link>
            </h3>
            <p>{event.description}</p>
            <p>Category: {event.category}</p>
            <p>Date: {event.date}</p>
            <p>Available Seats: {event.availableSeats}</p>
            <p>Price: ${event.price}</p>
            <button onClick={() => handleBooking(event.id)}>Book Ticket</button>
          </div>
        ))
      )}
      
      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventList;
