import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser, fetchUsers } from '../../Redux/adminSlice'
import { useNavigate } from 'react-router-dom'
import './edituser.css'

function EditUser({ userId, closeModal }) {
    const dispatch = useDispatch()
    const { users, loading, error } = useSelector((state) => state.admin)

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [profilePicture, setProfilePicture] = useState('')
    const [preview, setPreview] = useState(null)
    const [validationErrors, setValidationErrors] = useState({})

    const user = users.find((user) => user._id === userId)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/adminlogin')
        } else {
            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1]))
                const currentTime = Date.now() / 1000
                if (decodedToken.exp < currentTime) {
                    navigate('/adminlogin')
                } else if (user) {
                    setUsername(user.username)
                    setEmail(user.email)
                    setPhone(user.phone)
                    setProfilePicture(user.profilePicture)
                    setPreview(`http://localhost:3000${user.profilePicture}`)
                }
            } catch (error) {
                console.error('Failed to decode token:', error)
                navigate('/adminlogin')
            }
        }
    }, [ user])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setProfilePicture(file)
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result)
        }
        if (file) {
            reader.readAsDataURL(file)
        }
    }

    const validateForm = () => {
        const errors = {}
        if (!username) {
            errors.username = "Username is required"
        } else if (username.length < 3) {
            errors.username = "Username must be at least 3 characters long"
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email) {
            errors.email = "Email is required"
        } else if (!emailPattern.test(email)) {
            errors.email = "Please enter a valid email address"
        }

        const phonePattern = /^\d{10}$/
        if (!phone) {
            errors.phone = "Phone number is required"
        } else if (!phonePattern.test(phone)) {
            errors.phone = "Phone number must be 10 digits"
        }

        if (profilePicture instanceof File && profilePicture.size > 2 * 1024 * 1024) {
            errors.profilePicture = "File size must be less than 2MB"
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) {
            return
        }
        
        const updatedUser = new FormData()
        updatedUser.append('username', username)
        updatedUser.append('email', email)
        updatedUser.append('phone', phone)
        if (profilePicture instanceof File) {
            updatedUser.append('file', profilePicture)
        }
    
        try {
            const result = await dispatch(updateUser({ userId, updatedUser }))
            
            if (updateUser.rejected.match(result) && result.error.message === 'Token expired.') {
                handleTokenExpiry()
            } else {
                await dispatch(fetchUsers())
                closeModal()
            }
        } catch (error) {
            console.error('Error updating user:', error)
        }
    }
    
    const handleTokenExpiry = () => {
        alert('Your session has expired. Please log in again.')
        localStorage.removeItem("token")
        closeModal()
        window.location.href = '/adminlogin'
    }

    return (
        <div className="edit-user-container">
            <h2>Edit User</h2>
            <div> {error && <p className="error-message">Error: {error}</p>}</div>
            {loading && <p>Loading...</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                    {validationErrors.username && <p className="error-message">{validationErrors.username}</p>}
                </div>
                <div>
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    {validationErrors.email && <p className="error-message">{validationErrors.email}</p>}
                </div>
                <div>
                    <label>Phone</label>
                    <input 
                        type="text" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                    />
                    {validationErrors.phone && <p className="error-message">{validationErrors.phone}</p>}
                </div>
                <div>
                    <label>Profile Picture</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange} 
                    />
                    <img
                        src={preview}
                        alt="Profile Preview"
                        className="preview-img"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }}
                    />
                    {validationErrors.profilePicture && <p className="error-message">{validationErrors.profilePicture}</p>}
                </div>
                <button type="submit">Update User</button>
                <button type="button" onClick={closeModal}>Cancel</button>
            </form>
        </div>
    )
}

export default EditUser
