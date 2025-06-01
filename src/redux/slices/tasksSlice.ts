import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosInstance'
import type { Task, TasksState } from '../../types'

export const fetchTasks = createAsyncThunk<
  Task[],
  string,
  { rejectValue: string }
>('tasks/fetchTasks', async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Task[]>(`/tasks?userId=${userId}`)
    return response.data
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Failed to fetch tasks!')
  }
})

export const createTask = createAsyncThunk<
  Task,
  Omit<Task, 'id' | 'userId'>,
  { rejectValue: string }
>('tasks/createTask', async (task, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/tasks', task)
    return response.data
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Failed to create task!')
  }
})

export const deleteTask = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('tasks/deleteTask', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/tasks/${id}`)
    return id
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Failed to delete task!')
  }
})

const initialState: TasksState = {
  tasks: [],
  filter: 'all',
  isLoading: false,
  error: null,
}

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.isLoading = false
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.error = action.payload
        } else {
          state.error = 'Something went wrong'
        }
      })
      .addCase(createTask.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isLoading = false
        state.tasks.push(action.payload)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.error = action.payload
        } else {
          state.error = 'Something went wrong'
        }
      })
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        state.tasks = state.tasks.filter((task) => task.id !== action.payload)
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.error = action.payload
        } else {
          state.error = 'Something went wrong'
        }
      })
  },
})

export default tasksSlice.reducer
