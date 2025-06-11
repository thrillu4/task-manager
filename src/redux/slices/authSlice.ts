import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import axios from 'axios'
import axiosInstance from '../../api/axiosInstance'
import type { User, UserState } from '../../types'

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/users?email=${email}`)
    const user = response.data[0]
    if (user && user.password === password) {
      return user
    }
    return rejectWithValue('Invalid email or password!')
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Login failed!')
  }
})

export const registerUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>('auth/registerUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<User[]>(`/users`)
    const users = response.data
    if (users.some((user) => user.email === email)) {
      return rejectWithValue('User with this email already exist.')
    } else {
      rejectWithValue('Failed to check email')
    }
    const createResponse = await axiosInstance.post<User>('/users', {
      email,
      password,
      createdAt: Date.now().toString(),
    })
    return createResponse.data
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Register failed!')
  }
})

export const updateProfile = createAsyncThunk<
  User,
  { id: string; email: string; password: string },
  { rejectValue: string }
>(
  'auth/updateProfile',
  async ({ id, email, password }, { rejectWithValue }) => {
    try {
      const checkResponse = await axiosInstance.get<User[]>(
        `/users?email=${email}`
      )
      if (checkResponse.data.length > 0 && checkResponse.data[0].id !== id) {
        return rejectWithValue('Email already in use!')
      } else if (checkResponse.status === 404) {
        console.log('unlucky!!')
      }

      const response = await axiosInstance.put<User>(`/users/${id}`, {
        email,
        password: password || checkResponse.data[0].password,
        createdAt: Date.now().toString(),
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        const response = await axiosInstance.put<User>(`/users/${id}`, {
          email,
          password,
          createdAt: Date.now().toString(),
        })
        return response.data
      }
      if (error instanceof Error) {
        return rejectWithValue(error.name)
      }
      return rejectWithValue('Update profile failed!')
    }
  }
)

const initialState: UserState = {
  user: null,
  token: null,
  userId: null,
  isLoading: false,
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.userId = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false
        state.user = action.payload.email
        state.token = 'fake-token'
        state.userId = action.payload.id
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.error = action.payload
        } else {
          state.error = 'Something went wrong'
        }
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false
        state.user = action.payload.email
        state.token = 'fake-token'
        state.userId = action.payload.id
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.error = action.payload
        } else {
          state.error = 'Something went wrong'
        }
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false
          state.user = action.payload.email
        }
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.error = action.payload
        } else {
          state.error = 'Something went wrong'
        }
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
