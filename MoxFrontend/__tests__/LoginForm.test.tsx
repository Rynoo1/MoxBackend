import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LogInForm from '../src/renderer/src/components/LogInForm'

// src/renderer/src/components/LogInForm.test.tsx

describe('LogInForm', () => {
  const OLD_ALERT = window.alert
  let alertMock: jest.Mock

  beforeEach(() => {
    alertMock = jest.fn()
    window.alert = alertMock
    localStorage.clear()
    jest.resetAllMocks()
  })

  afterAll(() => {
    window.alert = OLD_ALERT
  })

  function fillAndSubmitLoginForm(
    email = 'test@example.com',
    username = 'testuser',
    password = 'password123'
  ): void {
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: email } })
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: username } })
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: password } })
    fireEvent.click(screen.getByRole('button', { name: /log in/i }))
  }

  it('renders login form fields', () => {
    render(<LogInForm />)
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('handles successful login', async () => {
    const fakeToken = 'jwt-token'
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: fakeToken })
    } as Response)

    render(<LogInForm />)
    fillAndSubmitLoginForm()

    await waitFor(() => {
      expect(localStorage.getItem('jwt')).toBe(fakeToken)
      expect(alertMock).toHaveBeenCalledWith('Login successful!')
    })
  })

  it('handles 2FA required', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ twoFactorRequired: true, userId: 'user-123' })
    } as Response)

    render(<LogInForm />)
    fillAndSubmitLoginForm()

    await waitFor(() => {
      expect(screen.getByText(/two-factor authentication/i)).toBeInTheDocument()
      expect(alertMock).toHaveBeenCalledWith('2FA code was sent to your email!')
    })
  })

  it('handles login error', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid email or password' })
    } as Response)

    render(<LogInForm />)
    fillAndSubmitLoginForm()

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Invalid email or password')
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    })
  })

  it('calls onLoginSuccess prop on successful login', async () => {
    const onLoginSuccess = jest.fn()
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'jwt-token' })
    } as Response)

    render(<LogInForm onLoginSuccess={onLoginSuccess} />)
    fillAndSubmitLoginForm()

    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalledWith('testuser')
    })
  })
})
