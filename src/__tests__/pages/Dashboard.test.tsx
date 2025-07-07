import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks'
import Dashboard, { fakeTasks } from '../../pages/Dashboard'
import type { RootState } from '../../redux/store'

vi.mock('react-calendar', () => ({
  default: ({ onChange }: { onChange: (date: Date) => void }) => (
    <div data-testid="calendar" onClick={() => onChange(new Date())}>
      Calendar
    </div>
  ),
}))

vi.mock('../../components/Modal.tsx', () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="modal">Modal content</div> : null,
}))

vi.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Bar: () => <div data-testid="bar" />,
}))

describe('Dashboard Page', () => {
  const mockNavigate = vi.fn()
  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
    vi.mocked(useAppSelector).mockImplementation(
      (selector: (state: RootState) => unknown) =>
        selector({
          auth: { user: null },
          tasks: { tasks: [] },
          settings: { theme: 'dark' },
        } as unknown as RootState)
    )
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should render a dashboard page without crashing and contains all blocks', () => {
    const component = render(<Dashboard />)

    expect(
      screen.getByRole('heading', { name: /welcome to dashboard/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Calendar/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Statistics/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /My Tasks/i })
    ).toBeInTheDocument()

    expect(component).toMatchSnapshot()
  })

  it('should render fakeTasks when user not logged in', () => {
    render(<Dashboard />)

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(fakeTasks.length)

    fakeTasks.forEach((task, index) => {
      expect(screen.getByText(task.title)).toBeInTheDocument()
      const checkbox = checkboxes[index]
      if (task.completed) {
        expect(checkbox).toBeChecked()
      } else {
        expect(checkbox).not.toBeChecked()
      }
    })
  })

  it('should render tasks if user logged in and has his own tasks', () => {
    vi.mocked(useAppSelector).mockImplementation(
      (selector: (state: RootState) => unknown) =>
        selector({
          auth: { user: { id: '1' } },
          tasks: { tasks: fakeTasks },
          settings: { theme: 'dark' },
        } as unknown as RootState)
    )

    render(<Dashboard />)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(3)

    fakeTasks.forEach((task, index) => {
      expect(screen.getByText(task.title)).toBeInTheDocument()
      const checkbox = checkboxes[index]
      if (task.completed) {
        expect(checkbox).toBeChecked()
      } else {
        expect(checkbox).not.toBeChecked()
      }
    })
  })

  it('should show notification string if user do not have tasks', () => {
    vi.mocked(useAppSelector).mockImplementation(
      (selector: (state: RootState) => unknown) =>
        selector({
          auth: { user: { id: '1' } },
          tasks: { tasks: [] },
        } as unknown as RootState)
    )

    render(<Dashboard />)

    expect(
      screen.getByText(/You don't have any tasks yet./i)
    ).toBeInTheDocument()
  })

  it('should open modal if user not logged in and click on checkbox or trash icon or add task', async () => {
    render(<Dashboard />)

    const checkbox = screen.getAllByRole('checkbox')[0]
    await userEvent.click(checkbox)
    expect(screen.getByTestId('modal')).toBeInTheDocument()

    const button = screen.getByTestId('fake-trash')
    await userEvent.click(button)
    expect(screen.getByTestId('modal')).toBeInTheDocument()
  })

  it('should navigate to /tasks if user logged in and click to any interactive buttons', async () => {
    vi.mocked(useAppSelector).mockImplementation(
      (selector: (state: RootState) => unknown) =>
        selector({
          auth: { user: { id: '1' } },
          tasks: { tasks: fakeTasks },
        } as unknown as RootState)
    )
    render(<Dashboard />)
    const checkbox = screen.getAllByRole('checkbox')[0]
    await userEvent.click(checkbox)
    expect(mockNavigate).toHaveBeenCalledWith('/tasks')

    const button = screen.getAllByTestId('trash')[0]
    await userEvent.click(button)
    expect(mockNavigate).toHaveBeenCalledWith('/tasks')

    const addBtn = screen.getByRole('button', { name: /add task/i })
    await userEvent.click(addBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/tasks?modal=add')
  })

  it('should render calendar and chart bar', () => {
    render(<Dashboard />)
    expect(screen.getByTestId('calendar')).toBeInTheDocument()
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    expect(screen.getByTestId('x-axis')).toBeInTheDocument()
    expect(screen.getByTestId('y-axis')).toBeInTheDocument()
    expect(screen.getByTestId('tooltip')).toBeInTheDocument()
    expect(screen.getByTestId('bar')).toBeInTheDocument()
  })
})
