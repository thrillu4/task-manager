import { XMarkIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  if (!isOpen) return null
  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="shadow-card animate-slide-in w-full max-w-md rounded-xl bg-white p-8 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Join Task Master
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <XMarkIcon className="h-6 w-6 cursor-pointer" />
          </button>
        </div>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Sign in or create an account to manage your tasks!
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              navigate('/login')
              onClose()
            }}
            className="flex-1 cursor-pointer rounded-lg bg-blue-600 p-3 text-white transition hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              navigate('/register')
              onClose()
            }}
            className="flex-1 cursor-pointer rounded-lg bg-yellow-600 p-3 text-white transition hover:bg-yellow-700 dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
