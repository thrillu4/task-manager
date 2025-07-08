import { render } from '@testing-library/react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import TasksPage from '../../pages/Tasks'
import type { RootState } from '../../redux/store'

describe('Tasks page', () => {
  const mockDispatch = vi.fn()
  const mockNavigate = vi.fn()
  beforeEach(() => {
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch)
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
                userId: '123',
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

  it('should render tasks page', () => {
    render(<TasksPage />)
  })
})
