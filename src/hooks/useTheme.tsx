import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '.'
import { setTheme } from '../redux/slices/settingsSlice'
import type { RootState } from '../redux/store'

export const useTheme = () => {
  const dispatch = useAppDispatch()
  const { theme } = useAppSelector((state: RootState) => state.settings)
  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
    )
  }, [theme, dispatch])

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))
  }

  return { theme, toggleTheme }
}
