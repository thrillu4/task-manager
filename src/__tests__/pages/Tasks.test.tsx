import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import TasksPage from '../../pages/Tasks'
import { logout } from '../../redux/slices/authSlice'
import type { RootState } from '../../redux/store'

describe('Tasks page', () => {
  const mockDispatch = vi.fn()
  const mockNavigate = vi.fn()
  beforeEach(() => {
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch)
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.resolve(),
    })
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
    vi.mocked(useAppSelector).mockImplementation(
      (selector: (state: RootState) => unknown) =>
        selector({
          auth: {
            userId: '1',
            user: 'test@gmail.com',
            token: '321323232132',
            isLoading: false,
            error: null,
          },
          tasks: {
            error: null,
            filter: 'all',
            isLoading: false,
            tasks: [
              {
                id: '1',
                title: 'Test task',
                description: 'test desc',
                completed: false,
                userId: '1',
                createdAt: '73213219321',
              },
            ],
          },
          settings: { theme: 'light' },
        })
    )
  })
  it('should redirect to /login if user not authenticated', () => {
    vi.mocked(useAppSelector).mockImplementation(
      (selector: (state: RootState) => unknown) =>
        selector({
          auth: { userId: null },
          tasks: { tasks: [] },
          settings: {},
        } as unknown as RootState)
    )
    render(<TasksPage />)

    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('should render tasks page and allows to change filter', async () => {
    render(<TasksPage />)

    expect(
      screen.getByRole('heading', { name: /task manager/i })
    ).toBeInTheDocument()

    const filterBtn = screen.getByRole('button', { name: /completed/i })

    await userEvent.click(filterBtn)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'tasks/setFilter',
      payload: 'completed',
    })
  })

  it('should show tasks and allows to toggle descriptions', async () => {
    render(<TasksPage />)

    const task = screen.getByText('Test task')
    expect(task).toBeInTheDocument()

    await userEvent.click(task)
    expect(screen.getByText('test desc')).toBeInTheDocument()

    await userEvent.click(task)
    expect(screen.queryByText('test desc')).not.toBeInTheDocument()
  })

  it('should show message if no tasks yet', () => {
    vi.mocked(useAppSelector).mockImplementation(
      (selector: (state: RootState) => unknown) =>
        selector({
          auth: { userId: '1' },
          tasks: { tasks: [] },
          settings: {},
        } as unknown as RootState)
    )
    render(<TasksPage />)

    expect(screen.getByText('No tasks yet')).toBeInTheDocument()
  })

  it('should open task form if user click to add task', async () => {
    render(<TasksPage />)

    const addBtn = screen.getByRole('button', { name: /add task/i })

    expect(addBtn).toBeInTheDocument()

    await userEvent.click(addBtn)

    expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument()
  })

  it('should log out if user click on button', async () => {
    render(<TasksPage />)

    const logoutBtn = screen.getByRole('button', { name: /log out/i })
    expect(logoutBtn).toBeInTheDocument()

    await userEvent.click(logoutBtn)

    expect(mockNavigate).toHaveBeenCalledWith('/login')
    expect(mockDispatch).toHaveBeenCalledWith(logout())
  })

  it('should toggle task completion', async () => {
    render(<TasksPage />)

    const checkbox = screen.getByRole('checkbox')

    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()

    await userEvent.click(checkbox)

    expect(mockDispatch).toHaveBeenCalled()
  })

  it('should delete task if user click on trash icon', async () => {
    render(<TasksPage />)

    const deleteBtn = screen.getByTestId('trash-icon')
    expect(deleteBtn).toBeInTheDocument()
    expect(screen.getByText('Test task')).toBeInTheDocument()

    await userEvent.click(deleteBtn)

    expect(mockDispatch).toHaveBeenCalled()
  })
})
