import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers, deleteUser, resetAdminState } from '../../Redux/adminSlice'
import EditUser from './EditUser'
import { useNavigate } from 'react-router-dom'
import './AdminDashboard.css'

function AdminDashboard() {
    const dispatch = useDispatch()
    const { adminData, users, loading, error } = useSelector((state) => state.admin)
    const token = localStorage.getItem("token")
    const API = "http://localhost:3000"

    const [isEditing, setIsEditing] = useState(false)
    const [userIdToEdit, setUserIdToEdit] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchUsersData()
    }, [])

    const fetchUsersData = async () => {
        const result = await dispatch(fetchUsers())
        if (fetchUsers.rejected.match(result)) {
            console.error('Error fetching users:', result.error)
            if (result.error.message === 'Token expired.') {
                handleLogout()
            }
        } else {
            console.log('Users fetched successfully:', result.payload)
        }
    }

    const openEditModal = (userId) => {
        console.log(`Edit button clicked for user ID: ${userId}`)
        setUserIdToEdit(userId)
        setIsEditing(true)
    }

    const closeEditModal = () => {
        console.log("Closing edit modal...")
        setIsEditing(false)
        setUserIdToEdit(null)
    }

    const handleDelete = (userId) => {
        if (window.confirm('Are you sure you want to delete the user?')) {
            dispatch(deleteUser(userId)).then(() => {
                dispatch(fetchUsers())
            })
        }
    }

    const handleLogout = () => {
        dispatch(resetAdminState())
        localStorage.removeItem("token")
        navigate('/adminlogin')
    }

    return (
        <div className="admin-dashboard">
            <div className="header">
                <h1>Admin Dashboard</h1>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {loading && <div className="loading">Loading...</div>}

            {error && (
                <div className="error-message">
                    Error: {typeof error === 'object' ? error.message || 'An unexpected error occurred.' : error}
                </div>
            )}

            {adminData && (
                <div className="admin-details">
                    <h2>Welcome, {adminData.username}</h2>
                    <p>Email: {adminData.email}</p>
                    <div className="admin-profile-pic-container">
                        {adminData.profilePicture ? (
                            <img
                                src={`${API}${adminData.profilePicture}`}
                                alt="Admin Profile"
                                className="admin-profile-pic"
                            />
                        ) : (
                            <div className="no-image">No Profile Image</div>
                        )}
                    </div>
                </div>
            )}

            <button onClick={() => navigate("/admin/add-user")}>Add New User</button>

            <div className="users-list">
                <h2>Users List</h2>
                {users.length === 0 ? (
                    <p className="no-users">No users found.</p>
                ) : (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Profile</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <img
                                            src={`${API}${user.profilePicture}`}
                                            alt={`${user.username}'s profile`}
                                            className="user-profile-pic"
                                        />
                                    </td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>
                                        <button onClick={() => openEditModal(user._id)}>Edit</button>
                                        <button onClick={() => handleDelete(user._id)} className="delete-button">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {isEditing && (
                <EditUser userId={userIdToEdit} closeModal={closeEditModal} />
            )}
        </div>
    )
}

export default AdminDashboard
