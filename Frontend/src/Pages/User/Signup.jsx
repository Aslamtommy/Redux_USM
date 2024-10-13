import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userSignUp } from "../../Redux/userSlice";
import "./signup.css";

const SignUp = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null); // State to store error messages
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmitChange = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous error

    try {
      const result = await dispatch(
        userSignUp({ username, email, phone, password, file: profilePicture })
      );

      if (userSignUp.fulfilled.match(result)) {
        navigate("/");
      } else if (userSignUp.rejected.match(result)) {
        // Set the error message received from the backend
        setError(result.payload?.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-header">Sign Up</h1>
      {error && <p className="error-message">{error}</p>} {/* Display error */}
      <div className="preview-container">
        {preview ? (
          <img src={preview} alt="Profile Preview" className="preview-img" />
        ) : (
          <div className="preview-placeholder"></div>
        )}
      </div>
      <form onSubmit={onSubmitChange} className="signup-form">
        <input
          type="text"
          placeholder="User name"
          onChange={(e) => setUsername(e.target.value)}
          className="signup-input"
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
        />
        <input
          type="text"
          placeholder="Phone"
          onChange={(e) => setPhone(e.target.value)}
          className="signup-input"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="signup-file"
        />
        <button type="submit" className="signup-button">
          Sign up
        </button>
      </form>
      <p className="signup-link">
        Already have an account? <a href="/">Sign in</a>
      </p>
    </div>
  );
};

export default SignUp;
