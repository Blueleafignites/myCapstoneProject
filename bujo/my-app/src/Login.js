import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        axios
            .post('http://localhost:3000/login', { email, password })
            .then((response) => {
                const { token } = response.data;
                localStorage.setItem('token', token);
                console.log(response.data);
                navigate('/lists');
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="container">
            <div className="login-box">
                <h2>Sign in</h2>
                <form onSubmit={handleLogin}>
                    <div className="login-group">
                        <input
                            type="email"
                            className="login-input"
                            id="email"
                            placeholder="Email address"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>
                    <div className="login-group">
                        <input
                            type="password"
                            className="login-input"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <button className="sign-in" type="submit">
                        Sign in
                    </button>
                </form>
                <p className="login-text">
                    Don't have an account? <a href="/">Sign up</a>
                </p>
                <p className="login-text">
                    Forgot your password? <a href="/">Reset password</a>
                </p>
            </div>
        </div>
    );
}

export default Login;
