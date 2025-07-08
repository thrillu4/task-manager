import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { useTheme } from '../../hooks/useTheme'
import Settings from '../../pages/Settings'

vi.mock('../../redux/slices/authSlice.ts', () => ({
  updateProfileEmail: vi.fn(() => () => Promise.resolve()),
  updateProfilePassword: vi.fn(() => () => Promise.resolve()),
}))

describe('Settings page', () => {
  const mockDispatch = vi.fn()
  const mockNavigate = vi.fn()
  const mockToggleTheme = vi.fn()

  beforeEach(() => {
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch)
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.resolve(),
    })
    vi.mocked(useAppSelector).mockReturnValue({
      user: 'test@gmail.com',
      userId: '1',
    })
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })
  it('should navigate user to /login if he is not auth', () => {
    vi.mocked(useAppSelector).mockReturnValue({
      userId: null,
    })
    render(<Settings />)
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('should render settings page', () => {
    const component = render(<Settings />)
    expect(screen.getByText(/settings/i)).toBeInTheDocument()
    expect(component).matchSnapshot()
  })

  it('should submit update email form ', async () => {
    render(<Settings />)

    const emailInput = screen.getByPlaceholderText(/your email/i)
    const newEmailInput = screen.getByPlaceholderText(/new email/i)
    const submitBtn = screen.getByRole('button', { name: /change email/i })

    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'test@gmail.com')
    await userEvent.type(newEmailInput, 'newtest1@gmail.com')
    await userEvent.click(submitBtn)

    expect(mockDispatch).toHaveBeenCalled()
  })

  it('should show error if email update failed', async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.reject('Email already used'),
    })
    render(<Settings />)

    const emailInput = screen.getByPlaceholderText(/your email/i)
    const newEmailInput = screen.getByPlaceholderText(/new email/i)
    const submitBtn = screen.getByRole('button', { name: /change email/i })

    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'test@gmail.com')
    await userEvent.type(newEmailInput, 'used@gmail.com')
    await userEvent.click(submitBtn)

    expect(screen.getByText(/Email already used/i)).toBeInTheDocument()
  })

  it('should submit update password form', async () => {
    render(<Settings />)

    const passwordInput = screen.getByPlaceholderText(/Old Password/i)
    const newPasswordInput = screen.getByPlaceholderText('New Password')
    const confirmNewPasswordInput =
      screen.getByPlaceholderText(/confirm new password/i)
    const submitBtn = screen.getByRole('button', { name: /change password/i })

    await userEvent.clear(passwordInput)
    await userEvent.type(passwordInput, '123456')
    await userEvent.type(newPasswordInput, '123321')
    await userEvent.type(confirmNewPasswordInput, '123321')
    await userEvent.click(submitBtn)

    expect(mockDispatch).toHaveBeenCalled()
  })

  it('should show error if update password failed', async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.reject('Incorrect old password'),
    })
    render(<Settings />)

    const passwordInput = screen.getByPlaceholderText(/Old Password/i)
    const newPasswordInput = screen.getByPlaceholderText('New Password')
    const confirmNewPasswordInput =
      screen.getByPlaceholderText(/confirm new password/i)
    const submitBtn = screen.getByRole('button', { name: /change password/i })

    await userEvent.clear(passwordInput)
    await userEvent.type(passwordInput, '11111111111')
    await userEvent.type(newPasswordInput, '123321')
    await userEvent.type(confirmNewPasswordInput, '123321')
    await userEvent.click(submitBtn)

    expect(screen.getByText('Incorrect old password')).toBeInTheDocument()
  })

  it('should toggle theme mode if user click on button', async () => {
    render(<Settings />)

    const btn = screen.getByRole('button', { name: /mode/i })

    await userEvent.click(btn)
    expect(mockToggleTheme).toHaveBeenCalled()
  })

  it('should show validate errors if inputs are incorrect in email change form', async () => {
    render(<Settings />)
    const emailInput = screen.getByPlaceholderText(/your email/i)
    const submitBtn = screen.getByRole('button', { name: /change email/i })

    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, '1test@gmail.com')
    await userEvent.click(submitBtn)

    expect(screen.getByText(/Enter a new email to change/i)).toBeInTheDocument()

    await userEvent.clear(emailInput)
    await userEvent.click(submitBtn)

    expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument()
  })

  it('should show validate errors if inputs are incorrect in password change form', async () => {
    render(<Settings />)
    const passwordInput = screen.getByPlaceholderText(/Old Password/i)
    const newPasswordInput = screen.getByPlaceholderText('New Password')
    const confirmNewPasswordInput =
      screen.getByPlaceholderText(/confirm new password/i)
    const submitBtn = screen.getByRole('button', { name: /change password/i })

    await userEvent.click(submitBtn)
    const messages = screen.getAllByText(/Password must/)
    expect(messages).toHaveLength(3)

    await userEvent.type(passwordInput, '11111111111')
    await userEvent.type(newPasswordInput, '123321')
    await userEvent.type(confirmNewPasswordInput, '321123')
    await userEvent.click(submitBtn)

    expect(screen.getByText('The new password must match')).toBeInTheDocument()
  })
})
