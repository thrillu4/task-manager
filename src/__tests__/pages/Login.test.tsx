import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import LoginPage from '../../pages/Login'
import { loginUser } from '../../redux/slices/authSlice'
import type { RootState } from '../../redux/store'

vi.mock('../../hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}))

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: vi.fn(),
    handleSubmit: vi.fn(
      (cb) => () => cb({ email: 'test@example.com', password: 'password123' })
    ),
    formState: { errors: {} },
  }),
}))

vi.mock('../../redux/slices/authSlice', () => ({
  loginUser: vi.fn(),
}))

describe('Login Page', () => {
  const mockNavigate = vi.fn()
  const mockDispatch = vi.fn()

  beforeEach(() => {
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch)
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
    vi.mocked(useAppSelector).mockImplementation(
      (selector: (state: RootState) => unknown) =>
        selector({
          auth: { isLoading: false, error: null },
        } as unknown as RootState)
    )
    mockDispatch.mockImplementation(() => ({ unwrap: () => Promise.resolve() }))
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should render login page and contain form', () => {
    const component = render(<LoginPage />)

    expect(
      screen.getByRole('heading', { name: /sign in/i })
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/enter your password/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /register/i })
    ).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })

  it('should display loading state on submit button', () => {
    vi.mocked(useAppSelector).mockImplementation(
      (selector: (state: RootState) => unknown) =>
        selector({
          auth: { isLoading: true, error: null },
        } as unknown as RootState)
    )
    render(<LoginPage />)

    expect(screen.getByRole('button', { name: /Log in/i })).toBeDisabled()
  })

  it('should display error message from state', () => {
    vi.mocked(useAppSelector).mockImplementation(
      (selector: (state: RootState) => unknown) =>
        selector({
          auth: { isLoading: false, error: 'Invalid credentials' },
        } as unknown as RootState)
    )
    render(<LoginPage />)

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
  })

  it('should successfully submit form and navigate to tasks', async () => {
    render(<LoginPage />)

    const form = screen.getByRole('form')
    fireEvent.submit(form)
    vi.waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        loginUser({
          email: 'test@gmail.com',
          password: '123456',
        })
      )
      expect(mockNavigate).toHaveBeenCalledWith('/tasks')
    })
  })

  it('should display validation errors for inputs', () => {
    vi.mock('react-hook-form', () => ({
      useForm: () => ({
        register: vi.fn(),
        handleSubmit: vi.fn(
          (cb) => () =>
            cb({ email: 'test@example.com', password: 'password123' })
        ),
        formState: {
          errors: {
            email: { message: 'Invalid email' },
            password: { message: 'Password too short' },
          },
        },
      }),
    }))
    render(<LoginPage />)

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    expect(screen.getByText(/password too short/i)).toBeInTheDocument()
  })

  it('should redirect user to register page if he click on button register', async () => {
    render(<LoginPage />)
    const btn = screen.getByRole('button', { name: /register/i })
    await userEvent.click(btn)
    expect(mockNavigate).toHaveBeenCalledWith('/register')
  })
})
