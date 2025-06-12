import { ArrowDownIcon, MoonIcon } from '@heroicons/react/24/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../hooks'
import { useTheme } from '../hooks/useTheme'
import {
  updateProfileEmail,
  updateProfilePassword,
} from '../redux/slices/authSlice'
import type { RootState } from '../redux/store'
import {
  profileEmailSchema,
  profilePasswordSchema,
  type ProfileEmailFormValue,
  type ProfilePasswordFormValue,
} from '../types'

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const dispatch = useAppDispatch()
  const { isLoading, user, userId } = useAppSelector(
    (state: RootState) => state.auth
  )
  const navigate = useNavigate()
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (!userId) {
      navigate('/login')
    }
  }, [userId, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileEmailFormValue>({
    resolver: zodResolver(profileEmailSchema),
    defaultValues: {
      email: user || '',
    },
  })

  const passwordForm = useForm<ProfilePasswordFormValue>({
    resolver: zodResolver(profilePasswordSchema),
  })

  const onEmailSubmit = (data: ProfileEmailFormValue) => {
    if (userId) {
      dispatch(updateProfileEmail({ newEmail: data.newEmail, id: userId }))
        .unwrap()
        .then(() => {
          toast.success('Your email updated successfully!')
          setEmailError('')
          reset()
        })
        .catch((err) => {
          toast.error(err)
          setEmailError(err)
        })
    }
  }

  const onPasswordSubmit = (data: ProfilePasswordFormValue) => {
    if (userId) {
      dispatch(
        updateProfilePassword({
          id: userId,
          email: user as string,
          newPassword: data.newPassword,
          oldPassword: data.oldPassword,
        })
      )
        .unwrap()
        .then(() => {
          toast.success('Your password updated successfully!')
          passwordForm.reset()
          setPasswordError('')
        })
        .catch((err) => {
          toast.error(err)
          setPasswordError(err)
        })
    }
  }

  return (
    <div className="min-h-screen flex-1 bg-gradient-to-br p-6 lg:ml-64 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto mt-10 max-w-4xl lg:mt-0">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 md:text-4xl dark:text-gray-100">
          Settings
        </h1>
        <div className="shadow-card mb-6 rounded-xl bg-white p-6 dark:bg-gray-800 dark:text-gray-100">
          <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            User Profile
          </h2>
          <p className="mb-4 dark:text-gray-100">
            Change your email here {''}
            <ArrowDownIcon className="inline w-5 animate-bounce" />
          </p>
          <form
            onSubmit={handleSubmit(onEmailSubmit)}
            className="mb-10 space-y-5"
          >
            <div>
              <label className="ml-3 dark:text-gray-100" htmlFor="email">
                Your Email Address:
              </label>
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
              <label className="ml-3 dark:text-gray-100" htmlFor="newEmail">
                Your New Email Address:
              </label>
              <input
                type="email"
                placeholder="New Email"
                className="border-gray-200, w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                {...register('newEmail')}
              />
              {errors.newEmail && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.newEmail.message}
                </p>
              )}
            </div>
            {emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              {isLoading ? 'Updating...' : 'Change Email'}
            </button>
          </form>

          <p className="mb-4 dark:text-gray-100">
            Change your password here {''}
            <ArrowDownIcon className="inline w-5 animate-bounce" />
          </p>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-5"
          >
            <div>
              <label className="ml-3" htmlFor="oldPassword">
                Your Current Password:
              </label>
              <input
                type="password"
                placeholder="Old Password"
                className="border-gray-200, w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                {...passwordForm.register('oldPassword')}
              />
              {passwordForm.formState.errors.oldPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {passwordForm.formState.errors.oldPassword.message}
                </p>
              )}
            </div>
            <div>
              <label className="ml-3" htmlFor="newPassword">
                Your New Password:
              </label>
              <input
                type="password"
                placeholder="New Password"
                className="border-gray-200, w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                {...passwordForm.register('newPassword')}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <div>
              <label className="ml-3" htmlFor="confirmNewPassword">
                Confirm Your New Password:
              </label>
              <input
                type="password"
                placeholder="Confirm New Password"
                className="border-gray-200, w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                {...passwordForm.register('confirmNewPassword')}
              />
              {passwordForm.formState.errors.confirmNewPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {passwordForm.formState.errors.confirmNewPassword.message}
                </p>
              )}
            </div>
            {passwordError && (
              <p className="mt-1 text-sm text-red-500">{passwordError}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              {isLoading ? 'Updating...' : 'Change Password'}
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
