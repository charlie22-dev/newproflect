import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import History from './pages/History';
import Admin from './pages/Admin';

function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />
        <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
        <Route path="/contact" element={<PrivateRoute><Contact /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
