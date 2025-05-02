import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { addUser, fetchUsers } from "../../Redux/adminSlice"
import "./addUser.css"

const AddUser = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [profilePicture, setProfilePicture] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/adminlogin")
    } else {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]))
        const currentTime = Date.now() / 1000
        if (decodedToken.exp < currentTime) {
          navigate("/adminlogin")
        }
      } catch (error) {
        console.error("Failed to decode token:", error)
        navigate("/adminlogin")
      }
    }
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setProfilePicture(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
  }

  const validatePhone = (phone) => {
    const phonePattern = /^[0-9]{10}$/
    return phonePattern.test(phone)
  }

  const validateUsername = (username) => {
    return username.trim().length >= 3
  }

  const validateProfilePicture = (file) => {
    if (!file) return false
    const validTypes = ["image/jpeg", "image/png", "image/gif"]
    return validTypes.includes(file.type)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!validateUsername(username)) {
      setError("Username must be at least 3 characters long")
      return
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
    if (!validatePhone(phone)) {
      setError("Phone number must be 10 digits")
      return
    }
    if (!validateProfilePicture(profilePicture)) {
      setError("Please upload a valid image (JPEG, PNG, or GIF)")
      return
    }
    try {
      const result = await dispatch(
        addUser({ username, email, phone, file: profilePicture })
      )
      if (addUser.fulfilled.match(result)) {
        dispatch(fetchUsers())
        navigate("/dashboard")
      } else if (addUser.rejected.match(result)) {
        setError(result.payload?.error || "Failed to add user Please try again")
      }
    } catch (error) {
      setError("An unexpected error occurred Please try again")
    }
  }

  return (
    <div className="adduser-container">
      <h1 className="adduser-header">Add User</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="preview-container">
        {preview ? (
          <img src={preview} alt="Profile Preview" className="preview-img" />
        ) : (
          <div className="preview-placeholder"></div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="adduser-form">
        <input
          type="text"
          placeholder="User name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="adduser-input"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="adduser-input"
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="adduser-input"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="adduser-file"
        />
        <button type="submit" className="adduser-button">
          Add User
        </button>
      </form>
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  )
}

export default AddUser
