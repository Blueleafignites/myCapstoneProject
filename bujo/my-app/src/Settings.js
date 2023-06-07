import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './settings.css';

function Settings({ darkMode, setDarkMode }) {
  const navigate  = useNavigate();

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // https://www.tutorialspoint.com/localstorage-in-reactjs
  const [selectedColor, setSelectedColor] = useState(
    localStorage.getItem('selectedColor') || 'default'
  );

  useEffect(() => {
    localStorage.setItem('selectedColor', selectedColor);
  }, [selectedColor]);

  // https://coolors.co/3fe4ec-fae459-c465d3-7cc140
  const handleColorChange = async (event) => {
    const newColor = event.target.value;
    setSelectedColor(newColor);
    const colorMap = {
      "default": {
        1: "#EB575C",
        2: "#FF9633",
        3: "#8EBB25",
        4: "#00AFFF",
      },
      "special": {
        1: "#5AEDF5",
        2: "#FDE969",
        3: "#E48BF1",
        4: "#A4D57A",
      },
    };

    const colorValues = colorMap[newColor];
    try {
      for (const [id, color] of Object.entries(colorValues)) {
        await axios.put(`http://localhost:3000/priorities/color/${id}`, { color });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    const token = localStorage.getItem("token");
  
    axios
      .post(
        "http://localhost:3000/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        localStorage.removeItem("token");
        navigate("/login");
        window.location.reload()
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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
        <h3>Priority Color Sets</h3>
        <div className="body-text">
          <label className="color-picker">
            <input type="radio" name="color" value="default" id="default-color" onChange={handleColorChange} checked={selectedColor === "default"} />
            <span className="color-list">Default</span>
            <span className="color-box" id="1" style={{ backgroundColor: "#EB575C" }}></span>
            <span className="color-box" id="2" style={{ backgroundColor: "#FF9633" }}></span>
            <span className="color-box" id="3" style={{ backgroundColor: "#A0C841" }}></span>
            <span className="color-box" id="4" style={{ backgroundColor: "#7AD6FA" }}></span>
          </label>

          <label className="color-picker">
            <input type="radio" name="color" value="special" id="special-color" onChange={handleColorChange} checked={selectedColor === "special"} />
            <span className="color-list">Special</span>
            <span className="color-box" id="1" style={{ backgroundColor: "#5AEDF5" }}></span>
            <span className="color-box" id="2" style={{ backgroundColor: "#FDE969" }}></span>
            <span className="color-box" id="3" style={{ backgroundColor: "#E48BF1" }}></span>
            <span className="color-box" id="4" style={{ backgroundColor: "#A4D57A" }}></span>
          </label>
        </div>

        <h3>Theme</h3>
        <div className="body-text">
          <label className="switch">
            <span>Darkmode:</span>
            <input type="checkbox" checked={darkMode} onChange={handleToggleDarkMode} />
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
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Settings;
