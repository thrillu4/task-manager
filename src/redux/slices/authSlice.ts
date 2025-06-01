import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
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
    const checkResponse = await axiosInstance.get(`/users?email=${email}`)
    if (checkResponse.data.length > 0) {
      return rejectWithValue('User with this email already exist.')
    }
    const response = await axiosInstance.post<User>('/users', {
      email,
      password,
      createdAt: Date.now().toString(),
    })
    return response.data
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Register failed!')
  }
})

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
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
