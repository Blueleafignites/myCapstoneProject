import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
    const navigate = useNavigate()

    const responseMessage = (response) => {
        console.log(response);
        navigate('/lists')
    };

    const errorMessage = (error) => {
        console.log(error);
    };

    return (
        <div className="container">
            <div className="login-box">
                <h2>Sign in</h2>
                <div className="google-login-button">
                    <GoogleLogin
                        clientId="189940497823-ktv9nu0hu5j5dqcfvstmd2tlt9uva9h7.apps.googleusercontent.com"
                        onSuccess={responseMessage}
                        onError={errorMessage}
                        render={({ onClick }) => (
                            <button onClick={onClick} type="submit"> Sign in with Google</button>
                        )}
                    />
                </div>
                <div className="login-group">
                    <input type="email" className="login-input" id="email" placeholder="Email address" />
                </div>
                <div className="login-group">
                    <input type="password" className="login-input" id="password" placeholder="Password" />
                </div>
                <button className="sign-in" type="submit">Sign in</button>
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
