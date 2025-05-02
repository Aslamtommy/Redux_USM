import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = 'http://localhost:3000'

export const userSignUp = createAsyncThunk(
    'user/signupUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API}/signup`, userData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const userSignIn = createAsyncThunk(
    'user/signIn',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API}/login`, userData)
            const { token, user } = response.data
            localStorage.setItem("token", token)
            localStorage.setItem("userId", user._id)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async (userId, { rejectWithValue, dispatch }) => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${API}/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            if (error.response && error.response.status === 401) {
              
                dispatch(logout()) // Clear user data and token from Redux and localStorage
            }
            return rejectWithValue(error.response.data)
        }
    }
)

// userSlice.js
export const updateUser = createAsyncThunk(
    'user/updateUser',
    async ({ userId, formData }, { rejectWithValue, dispatch }) => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.post(`${API}/updateUser/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            })
            dispatch(fetchUserData(userId))
            return response.data
        } catch (error) {
            if (error.response && error.response.status === 401) {
               
                return rejectWithValue("Token expired")
            }
            return rejectWithValue(error.response.data)
        }
    }
)

const initialState = {
    user: null,
    loading: false,
    error: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.error = null
            localStorage.removeItem("token")
            localStorage.removeItem("userId")
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.error || "Failed to fetch user data"
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = {
                    ...state.user,
                    user: action.payload.user, // Update user data with the new details
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.error || "Failed to update user data"
            })
    },
})

export const { logout } = userSlice.actions
export default userSlice.reducer
