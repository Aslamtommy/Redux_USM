import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserData, logout } from "../../Redux/userSlice";
import './Home.css'; // Import the CSS file here

// Utility function to check if a token is expired
const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now(); // Compare expiration time with current time
};

const UserProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const user = useSelector((state) => state.user.user);
    const loading = useSelector((state) => state.user.loading);
    

    useEffect(() => {
        console.log("Checking token...");
        if (!token || isTokenExpired(token)) {
            console.log("Token is missing or expired. Logging out and navigating to login.");
            dispatch(logout());
            navigate("/"); // Navigate to login if no token or token is expired
            return;
        }

        const userId = localStorage.getItem("userId");
        console.log("User ID:", userId);
        console.log("Token:", token);
        if (userId) {
            dispatch(fetchUserData(userId));
        }
    }, [token]);

   

    const handleLogout = () => {
        dispatch(logout());
        navigate("/"); // Navigate to login after logout
    };

    return (
        <div className="user-profile-container">
            <div className="user-profile-card">
                {loading ? (
                    <p>Loading...</p>
                ) : user ? (
                    <>
                        <div className="profile-picture-container">
                            {user.user.profilePicture ? (
                                <img
                                    src={user.user.profilePicture.startsWith("http") 
                                        ? user.user.profilePicture 
                                        : `http://localhost:3000${user.user.profilePicture}`}
                                    alt="Profile"
                                    className="user-profile-picture"
                                />
                            ) : (
                                <div className="user-no-image">No Image</div>
                            )}
                        </div>
                        <h1 className="user-greeting">
                            Welcome, {user.user.username || "User"}!
                        </h1>
                        <div className="user-details">
                            <p>Email: {user.user.email || "Not provided"}</p>
                            <p>Phone: {user.user.phone || "Not provided"}</p>
                        </div>
                        <div className="logout-button-container">
                            <button className="user-logout-button" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="user-not-found">User not found</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
