import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { updateUser } from "../../Redux/userSlice"
import './EditProfile.css'

const EditProfile = ({ user, onClose }) => {
    const dispatch = useDispatch()
    const [username, setUsername] = useState(user.username || "")
    const [email, setEmail] = useState(user.email || "")
    const [phone, setPhone] = useState(user.phone || "")
    const [profilePicture, setProfilePicture] = useState(null)
    const [preview, setPreview] = useState(user.profilePicture ? `http://localhost:3000${user.profilePicture}` : null)
    const [errorMessage, setErrorMessage] = useState("")

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setProfilePicture(file)

        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("username", username)
        formData.append("email", email)
        formData.append("phone", phone)
        if (profilePicture) {
            formData.append("file", profilePicture)
        }

        dispatch(updateUser({ userId: user._id, formData }))
            .unwrap()
            .then(() => {
                onClose() // Close the edit form after successful update
            })
            .catch((error) => {
                if (error === "Token expired") {
                    setErrorMessage("Your session has expired. Please log in again.")
                    setTimeout(() => {
                        // Redirect after 3 seconds
                        onClose() // Close the edit form if needed
                        window.location.href = "/"
                    }, 3000)
                } else {
                    setErrorMessage("Failed to update profile. Please try again.")
                }
            })
    }

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>} 
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {preview && <img src={preview} alt="Profile Preview" className="profile-preview" />}
                <div className="edit-buttons-container">
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default EditProfile
