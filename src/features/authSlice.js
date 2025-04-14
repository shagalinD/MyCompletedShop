import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialToken = localStorage.getItem('token') || null

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/signup',
        {
          email,
          password,
        }
      )
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка регистрации'
      )
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        {
          email,
          password,
        }
      )
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка авторизации'
      )
    }
  }
)

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async ({ firstName, lastName, phoneNumber }, { rejectWithValue, extra }) => {
    try {
      const { axiosInstance } = extra
      const response = await axiosInstance.put('/auth/update', {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
      })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка авторизации'
      )
    }
  }
)

export const getProfile = createAsyncThunk(
  'auth/profile',
  async (_, { rejectWithValue, extra }) => {
    try {
      const { axiosInstance } = extra
      const response = await axiosInstance.get('/auth/profile')
      return response.data
    } catch (error) {
      return rejectWithValue(error || 'Ошибка авторизации')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
    },
    token: initialToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
    setCredentials: (state, action) => {
      state.token = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = {
          firstName: action.payload.first_name,
          lastName: action.payload.last_name,
          phoneNumber: action.payload.phone_number,
          email: action.payload.email,
        }
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, setCredentials } = authSlice.actions
export default authSlice.reducer
