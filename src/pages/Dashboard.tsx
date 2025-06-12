import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useNavigate } from 'react-router-dom'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Modal from '../components/Modal'
import { useAppSelector } from '../hooks'
import type { RootState } from '../redux/store'
const fakeTasks = [
  {
    id: '1',
    title: 'Complete Project Proposal',
    description: '',
    completed: false,
    dueDate: '2025-06-10',
    userId: '',
    createdAt: '',
  },
  {
    id: '2',
    title: 'Schedule Team Meeting',
    description: '',
    completed: true,
    dueDate: '2025-06-12',
    userId: '',
    createdAt: '',
  },
  {
    id: '3',
    title: 'Review Documentation',
    description: '',
    completed: false,
    dueDate: '2025-06-15',
    userId: '',
    createdAt: '',
  },
]

const taskStats = [
  { name: 'Mon', tasks: 3 },
  { name: 'Tue', tasks: 1 },
  { name: 'Wed', tasks: 3 },
  { name: 'Thu', tasks: 2 },
  { name: 'Fri', tasks: 1 },
  { name: 'Sat', tasks: 0 },
  { name: 'Sun', tasks: 1 },
]

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state: RootState) => state.auth)
  const { tasks } = useAppSelector((state: RootState) => state.tasks)
  const [selectedDate, setSelectedDate] = useState<Value>(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleInteraction = () => {
    if (!user) {
      setModalOpen(true)
    } else {
      navigate('/tasks')
    }
  }

  const handleNavigateToAddTask = () => {
    if (!user) {
      setModalOpen(true)
    } else {
      navigate('/tasks?modal=add')
    }
  }

  return (
    <div className="h-full bg-gradient-to-br p-6 lg:ml-64 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl">
        <h1 className="mt-10 mb-6 text-center text-2xl font-bold text-gray-900 md:text-left md:text-4xl lg:mt-0 dark:text-gray-100">
          Welcome To Dashboard
        </h1>
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="shadow-card hover:shadow-card-hover col-span-1 w-full rounded-xl bg-white p-6 transition-all duration-300 dark:bg-gray-800">
            <h2 className="mb-4 text-center font-semibold text-gray-900 md:text-left md:text-2xl dark:text-gray-100">
              My Tasks
            </h2>
            <ul className="flex flex-col gap-y-4">
              {tasks.length > 0 && user
                ? tasks.slice(0, 3).map((task) => (
                    <li
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-4 transition hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                      key={task.id}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={handleInteraction}
                          className="mr-3 h-5 w-5 cursor-pointer rounded text-blue-600"
                        />
                        <div>
                          <span
                            className={`text-gray-900 dark:text-gray-100 ${task.completed ? 'line-through' : ''}`}
                          >
                            {task.title}
                          </span>
                          <p className="hidden text-sm text-gray-600 md:block dark:text-gray-400">
                            Due: {new Date(task.createdAt).toString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleInteraction}
                        className="cursor-pointer text-red-500 transition hover:text-red-600"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </li>
                  ))
                : fakeTasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-4 transition hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={handleInteraction}
                          className="mr-3 h-5 w-5 rounded text-blue-600"
                        />
                        <div>
                          <span
                            className={`text-gray-900 dark:text-gray-100 ${task.completed ? 'line-through' : ''}`}
                          >
                            {task.title}
                          </span>
                          <p className="hidden text-sm text-gray-600 md:block dark:text-gray-400">
                            Due: {task.dueDate}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleInteraction}
                        className="text-red-500 transition hover:text-red-600"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
            </ul>
            <button
              onClick={handleNavigateToAddTask}
              className="mt-4 flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 dark:bg-gray-700"
            >
              <PlusIcon className="mr-2 h-5 w-5" /> Add Task
            </button>
          </div>
          <div className="shadow-card hover:shadow-card-hover w-70 rounded-xl bg-white transition-all duration-300 md:w-auto md:p-6 dark:bg-gray-800">
            <h2 className="mb-4 text-center font-semibold text-gray-900 md:text-left md:text-2xl dark:text-gray-100">
              Calendar
            </h2>
            <Calendar
              locale="en"
              value={selectedDate}
              onChange={setSelectedDate}
              className="dark:bg-gray-800 dark:text-gray-900"
            />
          </div>
        </div>
        <div className="shadow-card hover:shadow-card-hover mt-6 rounded-xl bg-white transition-all duration-300 md:p-6 dark:bg-gray-800">
          <h2 className="mb-4 text-center font-semibold text-gray-900 md:text-left md:text-2xl dark:text-gray-100">
            Statistics
          </h2>
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={taskStats}>
              <XAxis dataKey="name" stroke="#4b5563" />
              <YAxis stroke="#4b5563" />
              <Tooltip />
              <Bar dataKey="tasks" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </div>
  )
}

export default Dashboard
