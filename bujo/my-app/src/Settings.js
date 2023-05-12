import React from 'react';
import './settings.css';

function Settings() {
  return (
    <div className="settings-container">
      <div className="settings-navbar">
        <a href="#profile">Profile</a>
        <a href="#customization">Customization</a>
        <a href="#login">Login</a>
        <a href="#collaboration">Collaboration</a>
        <a href="#archived">Archived Tasks</a>
        <a href="#logout">Logout</a>
      </div>
      <div className="settings-body">
        <h2 id="profile">Profile</h2>
        <hr />
        <h3>Change Username</h3>
        <div className="body-text">
          <label>Username:
            <input type="text" id="username" placeholder="Enter a username..." />
          </label>
          <button>Save</button>
        </div>

        <h2 id="customization">Customization</h2>
        <hr />
        <div className="body-text">
          <label className="switch">
            <span>Darkmode:</span>
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>

        <h2 id="login">Login</h2>
        <hr />
        <h3>Change Email</h3>
        <div className="body-text">
          <label>
            Email:
            <input type="text" id="email" />
          </label>
          <button>Save</button>
        </div>

        <h3>Change Password</h3>
        <div className="body-text">
          <label>
            Old Password:
            <input type="text" id="oldPassword" />
          </label>
          <label>
            New Password:
            <input type="text" id="newPassword" />
          </label>
          <label>
            Confirm New Password:
            <input type="text" id="confirmPassword" />
          </label>
          <button>Save</button>
        </div>

        <h2 id="collaboration">Collaboration</h2>
        <hr />
        <h3>Member Permissions</h3>
        <div className="body-text">
          <label className="switch">
            <span>Members can add tasks:</span>
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>

        <h3>Members</h3>
        <div className="body-text">

        </div>

        <h2 id="archived">Archived Tasks</h2>
        <hr />
        <div className="body-text">
          <label className="switch">
            <span>Delete Tasks After 30 Days:</span>
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>

        <h2 id="logout">Logout</h2>
        <hr />
        <button>Logout</button>
      </div>
    </div>
  );
}

export default Settings;
