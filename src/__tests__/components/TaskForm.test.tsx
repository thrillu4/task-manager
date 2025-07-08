import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskForm from '../../components/TaskForm'

describe('Task form component', () => {
  it('should render task form with title and inputs', () => {
    const component = render(<TaskForm onCancel={vi.fn()} onSubmit={vi.fn()} />)

    expect(screen.getByRole('heading')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    expect(component).matchSnapshot()
  })

  it('should close task form if user click on cancel button', async () => {
    const onCancel = vi.fn()
    render(<TaskForm onCancel={onCancel} onSubmit={vi.fn()} />)

    const cancelBtn = screen.getByRole('button', { name: /cancel/i })

    await userEvent.click(cancelBtn)
    expect(onCancel).toHaveBeenCalled()
  })

  it('should submit form if inputs filled', async () => {
    const onSubmit = vi.fn()
    render(<TaskForm onCancel={vi.fn()} onSubmit={onSubmit} />)

    const title = screen.getByPlaceholderText('Title')
    const descr = screen.getByPlaceholderText('Description')
    const saveButton = screen.getByRole('button', { name: /save/i })

    await userEvent.type(title, 'go to the gym')
    await userEvent.type(descr, 'leg day')
    await userEvent.click(saveButton)

    expect(onSubmit).toHaveBeenCalled()
  })

  it('should show validation errors if fields are empty', async () => {
    render(<TaskForm onCancel={vi.fn()} onSubmit={vi.fn()} />)

    const title = screen.getByPlaceholderText('Title')
    const descr = screen.getByPlaceholderText('Description')
    const saveButton = screen.getByRole('button', { name: /save/i })

    await userEvent.clear(title)
    await userEvent.clear(descr)
    await userEvent.click(saveButton)

    expect(screen.getByText('Title is required!')).toBeInTheDocument()
  })
})
