import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API = 'http://localhost:3000/admin'

export const adminLogin = createAsyncThunk(
    'admin/adminLogin',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API}`, credentials)
            const { admin, token } = response.data
            localStorage.setItem("token", token)
            localStorage.setItem("userId", admin._id)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const fetchUsers = createAsyncThunk(
    'admin/fetchUsers',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${API}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data.users
        } catch (error) {
            if (error.response && error.response.status === 401) {
                dispatch(resetAdminState())
                throw new Error('Token expired.')
            }
            return rejectWithValue(error.response.data)
        }
    }
)

export const updateUser = createAsyncThunk(
    'admin/updateUser',
    async ({ userId, updatedUser }, { rejectWithValue, dispatch }) => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.post(`${API}/updateuser/${userId}`, updatedUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data
        } catch (error) {
            if (error.response && error.response.status === 401) {
                dispatch(resetAdminState())
                throw new Error('Token expired.')
            }
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API}/deleteuser/${userId}`)
            return { userId, success: response.data.success }
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const addUser = createAsyncThunk(
    'admin/adduser',
    async (userData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.post(`${API}/adduser`, userData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data)
            }
            return rejectWithValue("Failed to add user. Please try again.")
        }
    }
)


// Create the admin slice using Redux Toolkit
const adminSlice = createSlice({
    name: "admin",
    initialState: {
        adminData: null, 
        users: [],       
        loading: false,  
        error: null,     
    },
    reducers: {
        resetAdminState: (state) => {
            state.adminData = null
            state.users = []
            state.loading = false
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending, (state) => {
                state.loading = true // Set loading to true on request start
                state.error = null   // Reset error on new request
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.loading = false 
                state.adminData = action.payload.admin // Store admin data
                state.error = null // Reset error on success
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload // Store error message from response
            })
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true
                state.error = null // Reset error before fetching
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false
                state.users = action.payload // Store fetched users
                state.error = null // Reset error on success
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload // Store error message from response
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true // Set loading to true on request start
                state.error = null // Reset error before updating
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false 
                const updatedUser = action.payload // Get updated user from response
                const index = state.users.findIndex(user => user._id === updatedUser._id)
                if (index !== -1) {
                    state.users[index] = updatedUser // Update the user in the list
                }
                state.error = null // Reset error on success
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload // Store error message from response
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true // Set loading to true while deleting
                state.error = null // Reset error before deleting
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false 
                if (action.payload.success) {
                    // Remove the user from the users array based on userId
                    state.users = state.users.filter(user => user._id !== action.payload.userId)
                }
                state.error = null // Reset error on success
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload // Store error message from response
            })
    },
})

// Export the reset action
export const { resetAdminState } = adminSlice.actions

// Export the reducer to use in the store
export default adminSlice.reducer
