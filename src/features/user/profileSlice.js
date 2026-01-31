import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie"; // Import Cookies for handling JWT tokens

// Define API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.interceptors.request.use((config) => {
  // Try to get token from cookies first, then from localStorage
  const token = Cookies.get("token") || 
               (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Add withCredentials to all requests
    config.withCredentials = true;
  }
  return config;
});

// Helper function to validate token
const validateToken = () => {
  // Try to get token from cookies first, then from localStorage
  const token = Cookies.get("token") || 
               (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null);
  
  if (!token) {
    console.error('No authentication token found in cookies or localStorage');
    throw new Error("No token found. Please log in again.");
  }
  
  return token;
};

// Create profile
export const createProfile = createAsyncThunk(
  "profile/createProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = validateToken();
      console.log('Creating profile with token:', token.substring(0, 10) + '...');
      
      // Make sure to use the full path with /api prefix
      const response = await axios.post(`${API_URL}/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      
      console.log('Profile creation successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Profile creation error:', error.message, error.response?.data);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Fetch profile data for the current user
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      // Get token from both sources
      const token = Cookies.get("token") || 
                  (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null);
      
      if (!token) {
        console.error('No token available for profile fetch');
        return rejectWithValue('Authentication token not found');
      }
      
      console.log('Fetching profile with token:', token.substring(0, 10) + '...');
      
      // Make sure to use the full path with /api prefix
      const response = await axios.get(`${API_URL}/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      
      console.log('Profile fetch successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Profile fetch error:', error.message, error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// Update profile data for the current user
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = validateToken();
      console.log('Updating profile with token:', token.substring(0, 10) + '...');
      
      // Make sure to use the full path with /api prefix
      const response = await axios.put(`${API_URL}/profile/me`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      
      console.log('Profile update successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error.message, error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// Delete profile
export const deleteProfile = createAsyncThunk(
  "profile/deleteProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete("/api/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete profile"
      );
    }
  }
);

// Profile Slice
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    // Reset profile state
    resetProfile: (state) => {
      state.profile = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload.profile;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Create profile
      .addCase(createProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete profile
      .addCase(deleteProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.status = "succeeded";
        state.profile = null;
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export actions
export const { resetProfile } = profileSlice.actions;

// Export reducer
export default profileSlice.reducer;
