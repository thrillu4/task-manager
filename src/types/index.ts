import { z } from 'zod'

export interface Task {
  title: string
  completed: boolean
  description: string
  userId: string
  id: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  password: string
  createdAt: string
}

export interface TasksState {
  tasks: Task[]
  filter: 'all' | 'completed' | 'pending'
  isLoading: boolean
  error: string | null
}

export interface UserState {
  user: string | null
  token: string | null
  userId: string | null
  isLoading: boolean
  error: string | null
}

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(3, 'Email is required!')
    .max(30, 'Max number of characters - 30'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(25, 'Max number of characters - 25'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    email: z
      .string()
      .email('Invalid email address')
      .min(3, 'Email is required!')
      .max(30),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(20),
    confirmPassword: z.string().min(6, 'Please confirm your password!'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password must match',
    path: ['confirmPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export const taskSchema = z.object({
  title: z.string().min(2, 'Title is required!'),
  description: z.string().optional(),
})
