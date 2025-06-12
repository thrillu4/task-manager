import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
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
    setFocus,
    formState: { errors },
  } = useForm<TaskValue>({
    resolver: zodResolver(taskSchema),
  })

  useEffect(() => {
    setFocus('title')
  }, [setFocus])

  const onSubmitForm = (data: TaskValue) => {
    onSubmit(data)
    reset()
  }

  return (
    <div className="shadow-card mb-6 rounded-xl bg-white p-6 dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
        Create Task
      </h2>
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Title"
            className="w-full rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            {...register('title')}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div>
          <textarea
            placeholder="Description"
            className="w-full rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-900 transition hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm
