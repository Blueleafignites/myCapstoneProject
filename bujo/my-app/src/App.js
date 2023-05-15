import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Data from './data';
import Settings from './Settings';
import Login from './Login';

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    const className = darkMode ? "dark-mode" : "light-mode";
    document.querySelector('html').classList.add(className);
    return () => {
      document.querySelector('html').classList.remove(className);
    };
  }, [darkMode]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Data />} />
          <Route path="/lists" element={<Data />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
