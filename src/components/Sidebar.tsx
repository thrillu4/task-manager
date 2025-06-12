import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  CheckCircleIcon,
  Cog6ToothIcon,
  HomeIcon,
  RectangleStackIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { logout } from '../redux/slices/authSlice'
import type { RootState } from '../redux/store'

const Sidebar = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state: RootState) => state.auth)
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const navItems = [
    { to: '/dashboard', icon: HomeIcon, label: 'Home' },
    ...(user
      ? [
          { to: '/tasks', icon: CheckCircleIcon, label: 'Tasks' },
          { to: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
          {
            to: '/',
            icon: ArrowLeftStartOnRectangleIcon,
            label: 'Log out',
            onClick: handleLogout,
          },
        ]
      : [
          { to: '/login', icon: UserIcon, label: 'Login' },
          { to: '/register', icon: UserIcon, label: 'Register' },
        ]),
  ]

  return (
    <>
      <button
        className="fixed top-1 left-1 z-50 rounded-lg bg-blue-600 p-2 text-white opacity-90 lg:hidden dark:bg-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>
      <div
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} z-40 flex w-64 flex-col bg-blue-800 text-white transition-transform duration-300 ease-in-out lg:z-10 lg:translate-x-0 dark:bg-gray-900`}
      >
        <div className="mt-10 flex items-center gap-2 p-6 md:mt-0">
          <RectangleStackIcon className="logo w-10" />
          <span className="text-2xl font-bold">Task Master</span>
        </div>
        <nav className="flex-1 space-y-2 px-4">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              onClick={
                item.onClick
                  ? (e) => {
                      e.preventDefault()
                      item.onClick()
                    }
                  : () => setIsOpen(false)
              }
              className={({ isActive }) =>
                `flex items-center rounded-lg p-3 transition-colors ${isActive ? 'bg-blue-600 dark:bg-gray-700' : 'hover:bg-blue-700 dark:hover:bg-gray-800'}`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}

export default Sidebar
