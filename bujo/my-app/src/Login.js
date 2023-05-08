import React from 'react';
import './login.css';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Login() {
    return (
        <div class="container">
            <form>
                <h1>Login</h1>
                <label for="email"><b>Email</b></label>
                <input type="text" placeholder="Enter Email" name="email" required />

                <label for="password"><b>Password</b></label>
                <input type="password" placeholder="Enter Password" name="password" required />

                <button type="submit">Login</button>
                <div class="forgot-password">
                    <a href="login.html">Forgot Password?</a>
                </div>
                <label>
                    <input type="checkbox" checked="checked" name="remember" /> Remember me
                </label>
            </form>
        </div>
    );
}

export default Login;

root.render(
  <React.StrictMode>
    <>
      <Login />
    </>
  </React.StrictMode>
);
