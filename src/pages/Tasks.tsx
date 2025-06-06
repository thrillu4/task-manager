import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import TaskForm from '../components/TaskForm'
import { useAppDispatch, useAppSelector } from '../hooks'
import { logout } from '../redux/slices/authSlice'
import {
  createTask,
  deleteTask,
  fetchTasks,
  setFilter,
  toggleTask,
} from '../redux/slices/tasksSlice'
import type { RootState } from '../redux/store'
const TasksPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const filterArr = ['all', 'completed', 'pending'] as const
  const { error, filter, isLoading, tasks } = useAppSelector(
    (state: RootState) => state.tasks
  )
  const userId = useAppSelector((state: RootState) => state.auth.userId)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (userId) {
      dispatch(fetchTasks(userId))
    } else {
      navigate('/login')
    }
  }, [dispatch, userId, navigate])

  const handleAddTask = (data: { title: string; description?: string }) => {
    if (userId) {
      dispatch(
        createTask({
          ...data,
          completed: false,
          userId,
        })
      )
        .unwrap()
        .then(() => {
          toast.success('Task Created!')
          setShowForm(false)
        })
        .catch((error) => toast.error(error))
    }
  }

  const handleToggleTask = (id: string) => {
    dispatch(toggleTask(id))
      .unwrap()
      .catch((error) => toast.error(error))
  }

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id))
      .unwrap()
      .then(() => toast.success('Task deleted!', { position: 'top-right' }))
      .catch((error) => toast.error(error))
  }

  const filteredTasks =
    filter === 'all'
      ? tasks
      : tasks.filter((task) => task.completed === (filter === 'completed'))

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              <PlusIcon className="mr-2 h-5 w-5" /> Add Task
            </button>
            <button
              onClick={() => {
                dispatch(logout())
                navigate('/login')
              }}
              className="cursor-pointer text-blue-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="mb-6 flex space-x-2">
          {filterArr.map((currFilter) => (
            <button
              onClick={() => {
                dispatch(setFilter(currFilter))
              }}
              key={currFilter}
              className={`cursor-pointer rounded-lg px-4 py-2 capitalize ${filter === currFilter ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {currFilter}
            </button>
          ))}
        </div>
        {showForm && (
          <TaskForm
            onCancel={() => setShowForm(false)}
            onSubmit={handleAddTask}
          />
        )}
        {isLoading && (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-blue-600"></div>
          </div>
        )}
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        {filteredTasks.length === 0 && <p>No tasks yet</p>}
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li
              className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md transition hover:shadow-lg"
              key={task.id}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
                className="mr-3 h-5 w-5 rounded text-blue-600"
              />
              <span>{task.title}</span>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-500 transition hover:text-red-600"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TasksPage
