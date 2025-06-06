import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import axios from 'axios'
import axiosInstance from '../../api/axiosInstance'
import type { Task, TasksState } from '../../types'
import type { RootState } from '../store'

export const fetchTasks = createAsyncThunk<
  Task[],
  string,
  { rejectValue: string }
>('tasks/fetchTasks', async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Task[]>(`/tasks?userId=${userId}`)
    return response.data
  } catch (error) {
    // handling the error, because mockApi doesn't give an empty array if user have no tasks :(
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return []
    }
    //
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Failed to fetch tasks!')
  }
})

export const createTask = createAsyncThunk<
  Task,
  Omit<Task, 'id' | 'createdAt'>,
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

export const toggleTask = createAsyncThunk<
  Task,
  string,
  { rejectValue: string; state: RootState }
>('tasks/toggleTask', async (id, { rejectWithValue, getState }) => {
  try {
    const state = getState() as { tasks: TasksState }
    const task = state.tasks.tasks.find((task) => task.id === id)
    if (!task) throw new Error('Task not found')
    const response = await axiosInstance.put(`/tasks/${id}`, {
      ...task,
      completed: !task.completed,
    })
    return response.data
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Failed to toggle task!')
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
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<'all' | 'completed' | 'pending'>
    ) => {
      state.filter = action.payload
    },
  },
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
      .addCase(toggleTask.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(toggleTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isLoading = false
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        )
        if (index !== -1) state.tasks[index] = action.payload
      })
      .addCase(toggleTask.rejected, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.error = action.payload
        } else {
          state.error = 'Something went wrong'
        }
      })
  },
})

export const { setFilter } = tasksSlice.actions
export default tasksSlice.reducer
