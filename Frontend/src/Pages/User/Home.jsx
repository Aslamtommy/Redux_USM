import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserData, logout } from "../../Redux/userSlice";
import EditProfile from "./EditProfile";
import './Home.css';
import './EditProfile.css'

const UserProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const user = useSelector((state) => state.user.user);
    const loading = useSelector((state) => state.user.loading);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        console.log("Checking token...");
        if (!token) {
            console.log("Token is missing or expired. Logging out and navigating to login.");
            navigate("/"); 
            return;
        }

        const userId = localStorage.getItem("userId");
        console.log("User ID:", userId);
        console.log("Token:", token);
        if (userId) {
            dispatch(fetchUserData(userId));
        }
    }, [token, dispatch, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/"); 
    };

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
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
                                    src={`http://localhost:3000${user.user.profilePicture}`}
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
                        <div className="action-buttons-container">
                            <button className="edit-profile-button" onClick={handleEditProfile}>
                                Edit Profile
                            </button>
                            <button className="user-logout-button" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="user-not-found">User not found</p>
                )}
            </div>
            {isEditing && (
    <>
        <div className="modal-overlay" onClick={handleCloseEdit}></div>
        <div className="edit-profile-modal">
            <EditProfile user={user.user} onClose={handleCloseEdit} />
        </div>
    </>
)}

        </div>
    );
};

export default UserProfile;
