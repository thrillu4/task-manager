import '@testing-library/jest-dom/vitest'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Stub the global ResizeObserver
vi.stubGlobal('ResizeObserver', ResizeObserverMock)

vi.mock('../hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  NavLink: vi.fn(({ to, className, children, ...props }) => (
    <a
      href={to}
      className={
        typeof className === 'function'
          ? className({ isActive: false })
          : className
      }
      {...props}
    >
      {children}
    </a>
  )),
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
