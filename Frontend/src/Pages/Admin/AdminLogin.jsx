// AdminLogin.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../Redux/adminSlice';
import './AdminLogin.css';

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error,setError]=useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(adminLogin({ email, password }));

        if (adminLogin.fulfilled.match(resultAction)) {
            navigate("/dashboard");
        } else {
            // Handle login failure (optional)
            const errormessage=resultAction.payload?.error
            setError(errormessage)
   
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h1 className="admin-login-title">Admin Login</h1>
                {error && <p className="error-message">{error}</p>}
            
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Email" 
                        className="admin-input" 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="admin-input" 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <button className="admin-button" type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
