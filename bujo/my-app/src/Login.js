import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './login.css';

function Login() {
    const responseMessage = (response) => {
        console.log(response);
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
                <button type="submit">Sign in</button>
                <p>
                    Don't have an account? <a href="index.html">Sign up</a>
                </p>
                <p>
                    Forgot your password? <a href="index.html">Reset password</a>
                </p>
            </div>
        </div>
    );
}

export default Login;
