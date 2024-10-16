import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import EventList from './components/EventList';
import Login from './components/Login';
import EventDetail from './components/EventDetail';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/event/:id" element={<EventDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
