import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../hooks'
import { loginUser } from '../redux/slices/authSlice'
import type { RootState } from '../redux/store'
import type { LoginFormValues } from '../types'
import { loginSchema } from '../types'

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormValues) => {
    dispatch(loginUser(data))
      .unwrap()
      .then(async () => {
        toast.success('Login successful!')
        await new Promise((resolve) => setTimeout(resolve, 1000))
        navigate('/tasks')
      })
      .catch((err: string) => {
        toast.error(err)
      })
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
      <div className="min-w-[500px] rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Sign In
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-12 flex flex-col">
          <div className="mb-10 flex flex-col gap-2.5">
            <label className="ml-2.5" htmlFor="email">
              Email
            </label>
            <input
              maxLength={40}
              className="h-15 rounded-lg border-[0.6px] border-[#d0d5dd] px-7 py-5 placeholder:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              type="email"
              {...register('email')}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-5 flex flex-col gap-2.5">
            <label className="ml-2.5" htmlFor="password">
              Password
            </label>
            <input
              maxLength={25}
              className="h-15 rounded-lg border-[0.6px] border-[#d0d5dd] px-7 py-5 placeholder:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              type="password"
              {...register('password')}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          <button
            className="mt-5 mb-14 cursor-pointer rounded-md bg-[#57f] py-4.5 text-white transition hover:bg-blue-700 disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-[#7d7d7d]">
          Don't have an account?{' '}
          <a className="text-[#57f] hover:underline" href="/register">
            Register
          </a>
        </p>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  )
}

export default LoginPage
