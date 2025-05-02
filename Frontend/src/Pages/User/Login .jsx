import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { userSignIn } from '../../Redux/userSlice';
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State for storing error messages
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Clear any previous error

    dispatch(userSignIn({ email, password })).then((result) => {
      // Check if the action was fulfilled
      if (result.meta.requestStatus === 'fulfilled') {
        navigate("/Home");
      } else {
        // Handle the case where login was not successful
        const errorMessage = result.payload?.error 
        setError(errorMessage); // Set error message to display
      }
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="button-container">
            <button className="login-button" type="submit">Login</button>
          </div>
        </form>
        <div className="signup-link">
          <p>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="signup-text"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
