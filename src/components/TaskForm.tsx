import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { taskSchema, type TaskValue } from '../types'

interface TaskFormProps {
  onSubmit: (task: TaskValue) => void
  onCancel: () => void
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskValue>({
    resolver: zodResolver(taskSchema),
  })

  const onSubmitForm = (data: TaskValue) => {
    onSubmit(data)
    reset()
  }

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Create Task</h2>
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Task title"
            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            {...register('title')}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div>
          <textarea
            placeholder="Task description"
            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-900 transition hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm
