import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userSignUp } from "../../Redux/userSlice";
import "./signup.css";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Validation functions
  const isUsernameValid = (name) => /^[a-zA-Z0-9_]{3,20}$/.test(name);
  const isEmailValid = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone) =>
    /^[0-9]{10}$/.test(phone);
  const isPasswordValid = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  const isProfilePictureValid = (file) =>
    file && file.size <= 2 * 1024 * 1024; // Maximum 2 MB

  const onSubmitChange = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous error

    // Perform validations before proceeding
    if (!isUsernameValid(username)) {
      setError(
        "Username should be 3-20 characters long and can contain letters, numbers, and underscores."
      );
      return;
    }

    if (!isEmailValid(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isPhoneValid(phone)) {
      setError("Phone number should be exactly 10 digits.");
      return;
    }

    if (!isPasswordValid(password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one letter and one number."
      );
      return;
    }

    if (!isProfilePictureValid(profilePicture)) {
      setError("Profile picture is required and should not exceed 2 MB.");
      return;
    }

    try {
      const result = await dispatch(
        userSignUp({ username, email, phone, password, file: profilePicture })
      );

      if (userSignUp.fulfilled.match(result)) {
        navigate("/");
      } else if (userSignUp.rejected.match(result)) {
        setError(result.payload?.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-header">Sign Up</h1>
      {error && <p className="error-message">{error}</p>}
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
          required
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
          required
        />
        <input
          type="text"
          placeholder="Phone"
          onChange={(e) => setPhone(e.target.value)}
          className="signup-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="signup-file"
          required
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
