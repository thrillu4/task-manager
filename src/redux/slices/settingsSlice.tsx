import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { SettingsState } from '../../types'

const initialState: SettingsState = {
  theme: localStorage.theme
    ? (localStorage.getItem('theme') as 'light' | 'dark')
    : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
    },
  },
})

export const { setTheme } = settingsSlice.actions
export default settingsSlice.reducer
