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
