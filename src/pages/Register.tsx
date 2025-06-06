import { zodResolver } from '@hookform/resolvers/zod'
import type React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../hooks'
import { registerUser } from '../redux/slices/authSlice'
import type { RootState } from '../redux/store'
import { registerSchema, type RegisterFormValues } from '../types'

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { error, isLoading } = useAppSelector((state: RootState) => state.auth)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormValues) => {
    dispatch(registerUser({ email: data.email, password: data.password }))
      .unwrap()
      .then(async () => {
        toast.success('Registration successful!')
        await new Promise((resolve) => setTimeout(resolve, 3000))
        navigate('/tasks')
      })
      .catch((err: string) => {
        toast.error(err)
      })
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <div className="mb-10 flex flex-col gap-2.5">
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
          <div className="mb-10 flex flex-col gap-2.5">
            <label className="ml-2.5" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="h-15 rounded-lg border-[0.6px] border-[#d0d5dd] px-7 py-5 placeholder:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 p-3 text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign In
          </a>
        </p>
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  )
}

export default RegisterPage
