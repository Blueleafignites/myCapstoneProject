import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './navigation.css';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="189940497823-ktv9nu0hu5j5dqcfvstmd2tlt9uva9h7.apps.googleusercontent.com">
    <React.StrictMode>
      <>
        <App />
      </>
    </React.StrictMode>
  </GoogleOAuthProvider>,
);
