import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import settingsReducer from './slices/settingsSlice'
import tasksReducer from './slices/tasksSlice'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer,
    settings: settingsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
