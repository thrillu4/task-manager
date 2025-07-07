import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { logout } from '../../redux/slices/authSlice'

describe('SideBar component', () => {
  const mockDispatch = vi.fn()
  const mockNavigate = vi.fn()
  beforeEach(() => {
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch)
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
    vi.mocked(useAppSelector).mockReturnValue({
      user: null,
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should render sidebar for unauthenticated user', () => {
    const component = render(<Sidebar />)

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText(/register/i)).toBeInTheDocument()
    expect(screen.getByText(/login/i)).toBeInTheDocument()
    expect(screen.queryByText(/Settings/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Tasks/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Log out/i)).not.toBeInTheDocument()

    expect(component).matchSnapshot()
  })

  it('should render nav links for logged in user', () => {
    vi.mocked(useAppSelector).mockReturnValue({
      user: 'Alex',
    })
    render(<Sidebar />)

    expect(screen.getByText(/Tasks/i)).toBeInTheDocument()
    expect(screen.getByText(/Settings/i)).toBeInTheDocument()
    expect(screen.getByText(/Log out/i)).toBeInTheDocument()
    expect(screen.queryByText(/register/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/login/i)).not.toBeInTheDocument()
  })

  it('should toggle sidebar and display menu on mobile if user click on menu button', async () => {
    render(<Sidebar />)

    const menuBtn = screen.getByRole('button')
    const sideBarMenu = screen.getByTestId('menu')

    expect(sideBarMenu).toHaveClass('-translate-x-full')
    await userEvent.click(menuBtn)
    expect(sideBarMenu).toHaveClass('translate-x-0')
    await userEvent.click(menuBtn)
    expect(sideBarMenu).toHaveClass('-translate-x-full')
  })

  it('should close menu if user click nav link or overlay on mobile', async () => {
    render(<Sidebar />)
    const menuBtn = screen.getByRole('button')
    const sideBarMenu = screen.getByTestId('menu')
    const homeLink = screen.getByText(/home/i)

    await userEvent.click(menuBtn)
    expect(sideBarMenu).toHaveClass('translate-x-0')
    await userEvent.click(homeLink)
    expect(sideBarMenu).toHaveClass('-translate-x-full')
    await userEvent.click(menuBtn)
    expect(sideBarMenu).toHaveClass('translate-x-0')
    const overlay = screen.queryByTestId('overlay')
    expect(overlay).toBeInTheDocument()
    if (overlay) {
      await userEvent.click(overlay)
    }
    expect(sideBarMenu).toHaveClass('-translate-x-full')
  })

  it('should navigate user to home page if he click log out link', async () => {
    vi.mocked(useAppSelector).mockReturnValue({
      user: 'Alex',
    })
    render(<Sidebar />)

    const logOutLink = screen.getByText(/log out/i)

    await userEvent.click(logOutLink)

    expect(mockDispatch).toHaveBeenCalledWith(logout())
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
