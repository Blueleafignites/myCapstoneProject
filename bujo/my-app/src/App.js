import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Data from './data';
import Settings from './Settings';
import Login from './Login';
import Features from './Features';

function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    const className = darkMode ? 'dark-mode' : 'light-mode';
    document.querySelector('html').classList.add(className);
    return () => {
      document.querySelector('html').classList.remove(className);
    };
  }, [darkMode]);

  /*
    https://stackoverflow.com/questions/69923420/how-to-use-private-route-in-react-router-domv6
    https://www.javatpoint.com/browserrouter-in-react#:~:text=React%20Router%20is%20a%20standard%20library%20for%20routing,keeps%20the%20UI%20in%20sync%20with%20the%20URL.
  */
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/lists" replace /> : <Login />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/lists" replace /> : <Login />} />
        <Route path="/settings" element={isAuthenticated ? <Settings darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/login" replace />} />
        <Route path="/lists" element={isAuthenticated ? <Data /> : <Navigate to="/login" replace />} />
        <Route path="/features" element={<Features />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
