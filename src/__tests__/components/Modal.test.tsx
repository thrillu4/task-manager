import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useNavigate } from 'react-router-dom'
import Modal from '../../components/Modal'

describe('modal form', () => {
  const mockNavigate = vi.fn()
  const onClose = vi.fn()

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should not display modal with prop isOpen is false', () => {
    const component = render(<Modal isOpen={false} onClose={onClose} />)

    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument()
    expect(component).matchSnapshot()
  })

  it('should render modal with isOpen is true prop', () => {
    render(<Modal isOpen={true} onClose={onClose} />)

    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('should close modal if user click on X (close) button', async () => {
    render(<Modal isOpen={true} onClose={onClose} />)

    const closeBtn = screen.getByTestId('close')

    await userEvent.click(closeBtn)

    expect(onClose).toHaveBeenCalled()
  })

  it('should navigate to /login if user click on sign in button', async () => {
    render(<Modal isOpen={true} onClose={onClose} />)

    const signInBtn = screen.getByRole('button', { name: /sign in/i })

    await userEvent.click(signInBtn)

    expect(onClose).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('should navigate to /register if user click on sign up button', async () => {
    render(<Modal isOpen={true} onClose={onClose} />)

    const signUpBtn = screen.getByRole('button', { name: /sign up/i })

    await userEvent.click(signUpBtn)

    expect(onClose).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/register')
  })
})
