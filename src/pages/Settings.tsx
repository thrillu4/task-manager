import { MoonIcon } from '@heroicons/react/24/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../hooks'
import { useTheme } from '../hooks/useTheme'
import { updateProfile } from '../redux/slices/authSlice'
import type { RootState } from '../redux/store'
import { profileSchema, type ProfileFormValue } from '../types'

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const dispatch = useAppDispatch()
  const { error, isLoading, user, userId } = useAppSelector(
    (state: RootState) => state.auth
  )
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<ProfileFormValue>({
    resolver: zodResolver(profileSchema),
    defaultValues: { email: user || '', password: '' },
  })

  const onSubmit = (data: ProfileFormValue) => {
    if (userId) {
      dispatch(updateProfile({ ...data, id: userId }))
        .unwrap()
        .then(() => toast.success('Profile updated successfully!'))
        .catch((err) => toast.error(err))
    }
  }

  return (
    <div className="min-h-screen flex-1 bg-gradient-to-br p-6 lg:ml-64 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <div className="shadow-card mb-6 rounded-xl bg-white p-6 dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Profile
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="border-gray-200, w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="New Password (optional)"
                className="border-gray-200, w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
        <div className="shadow-card rounded-xl bg-white p-6 dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Appearance
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-900 dark:text-gray-100">Theme:</span>
            <button
              onClick={toggleTheme}
              className="text-bg-gray-200 cursor-pointer rounded-lg border border-gray-700 bg-gray-700 px-4 py-2 text-white transition hover:bg-gray-300 hover:text-gray-900 dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              {theme === 'light' ? 'Dark' : 'Light'} Mode
              <MoonIcon className="inline w-6 pl-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
