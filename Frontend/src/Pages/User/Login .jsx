import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSignIn } from '../../Redux/userSlice'
import { useNavigate } from "react-router-dom";
import "./Login.css";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(userSignIn({ email, password })).then((result) => {
      
      if (userSignIn.fulfilled.match(result)) {
        navigate("/Home");
      }
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login</h1>
       
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="button-container">
            <button className="login-button">Login</button>
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
