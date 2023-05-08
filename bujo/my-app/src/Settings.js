import React from 'react';
import './settings.css';

function Settings() {
  return (
    <div className="settings-container">
      <div className="settings-navbar">
        <a href="#Profile">Profile</a>
        <p>Customization</p>
        <p>Login</p>
        <p>Collaboration</p>
      </div>
      <div className="settings-body">
        <h2>Profile</h2>
        <div className="body-text">
          <p>Username: </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
