import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import LoginForm from '../src/renderer/src/components/LogInForm'

// Mock react-router-dom
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

// Mock the loading gif import
jest.mock('../src/renderer/src/assets/mox-loading.gif', () => 'mock-loading-gif')

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
global.localStorage = localStorageMock

// Mock window.alert
global.alert = jest.fn()

// Mock fetch
global.fetch = jest.fn()

const renderLoginForm = (props = {}) => {
  return render(
    <BrowserRouter>
      <LoginForm {...props} />
    </BrowserRouter>
  )
}

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    fetch.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.getItem.mockClear()
    mockNavigate.mockClear()
    alert.mockClear()
  })

  describe('Initial Render', () => {
    test('renders login form with all required fields', () => {
      renderLoginForm()

      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Username')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument()
    })

    test('renders form inputs with correct attributes', () => {
      renderLoginForm()

      const emailInput = screen.getByLabelText('Email')
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')

      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('required')
      expect(usernameInput).toHaveAttribute('type', 'text')
      expect(usernameInput).toHaveAttribute('required')
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('required')
    })
  })

  describe('Form Input Handling', () => {
    test('updates input values when user types', () => {
      renderLoginForm()

      const emailInput = screen.getByLabelText('Email')
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(usernameInput, { target: { value: 'testuser' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })

      expect(emailInput.value).toBe('test@example.com')
      expect(usernameInput.value).toBe('testuser')
      expect(passwordInput.value).toBe('password123')
    })
  })

  describe('Successful Login (No 2FA)', () => {
    test('handles successful login without 2FA', async () => {
      const mockResponse = {
        Token: 'mock-token',
        userId: 'user123',
        role: 'basic',
        IsAdmin: false
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const mockOnLoginSuccess = jest.fn()
      renderLoginForm({ onLoginSuccess: mockOnLoginSuccess })

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })

      fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('http://localhost:5183/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Email: 'test@example.com',
            Password: 'password123'
          })
        })
      })

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-token')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('userEmail', 'test@example.com')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('userId', 'user123')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('userRole', 'basic')
        expect(alert).toHaveBeenCalledWith('Login successful!')
        expect(mockNavigate).toHaveBeenCalledWith('/')
        expect(mockOnLoginSuccess).toHaveBeenCalledWith('testuser')
      })
    })

    test('handles admin login', async () => {
      const mockResponse = {
        Token: 'admin-token',
        userId: 'admin123',
        role: 'admin',
        IsAdmin: true
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      renderLoginForm()

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@example.com' } })
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'admin' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'adminpass' } })

      fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith('Welcome Admin!')
      })
    })

    test('handles special admin email case', async () => {
      const mockResponse = {
        Token: 'token',
        userId: 'user123',
        role: 'basic',
        IsAdmin: false
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      renderLoginForm()

      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'ryno.debeer12@gmail.com' }
      })
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'ryno' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } })

      fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('isAdmin', 'true')
      })
    })
  })

  describe('Two-Factor Authentication', () => {
    test('shows 2FA form when twoFactorRequired is true', async () => {
      const mockResponse = {
        twoFactorRequired: true,
        userId: 'user123'
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      renderLoginForm()

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })

      fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

      await waitFor(() => {
        expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument()
        expect(screen.getByText('Please enter the code sent to your email')).toBeInTheDocument()
        expect(screen.getByLabelText('Code')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Verify Code' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Back to Login' })).toBeInTheDocument()
        expect(alert).toHaveBeenCalledWith('2FA code was sent to your email!')
      })
    })

    test('handles 2FA code input', async () => {
      const mockLoginResponse = {
        twoFactorRequired: true,
        userId: 'user123'
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLoginResponse
      })

      renderLoginForm()

      // Trigger initial login to show 2FA form
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
      fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

      await waitFor(() => {
        expect(screen.getByLabelText('Code')).toBeInTheDocument()
      })

      const codeInput = screen.getByLabelText('Code')
      fireEvent.change(codeInput, { target: { value: '123456' } })

      expect(codeInput.value).toBe('123456')
    })

    test('handles successful 2FA verification', async () => {
      const mockLoginResponse = {
        twoFactorRequired: true,
        userId: 'user123'
      }

      const mock2FAResponse = {
        token: '2fa-token',
        role: 'basic',
        IsAdmin: false
      }

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockLoginResponse
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mock2FAResponse
        })

      renderLoginForm()

      // Initial login
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
      fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

      await waitFor(() => {
        expect(screen.getByLabelText('Code')).toBeInTheDocument()
      })

      // Enter 2FA code
      fireEvent.change(screen.getByLabelText('Code'), { target: { value: '123456' } })
      fireEvent.click(screen.getByRole('button', { name: 'Verify Code' }))

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('http://localhost:5183/api/user/login/2fa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'user123',
            TwoFactorCode: '123456'
          })
        })
      })

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('token', '2fa-token')
        expect(alert).toHaveBeenCalledWith('Login Successful!')
        expect(mockNavigate).toHaveBeenCalledWith('/')
      })
    })

    test('handles back to login from 2FA form', async () => {
      const mockLoginResponse = {
        twoFactorRequired: true,
        userId: 'user123'
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLoginResponse
      })

      renderLoginForm()

      // Trigger 2FA form
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
      fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Back to Login' })).toBeInTheDocument()
      })

      // Click back to login
      fireEvent.click(screen.getByRole('button', { name: 'Back to Login' }))

      // Should show login form again
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Username')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument()

      // Fields should be cleared
      expect(screen.getByLabelText('Email').value).toBe('')
      expect(screen.getByLabelText('Username').value).toBe('')
      expect(screen.getByLabelText('Password').value).toBe('')
    })
  })

  describe('Error Handling', () => {
    test('handles login API error', async () => {
      const errorResponse = {
        message: 'Invalid credentials'
      }

      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => errorResponse
      })

      const mockOnSetError = jest.fn()
      renderLoginForm({ onSetError: mockOnSetError })

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } })
      fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith('Invalid credentials')
        expect(mockOnSetError).toHaveBeenCalledWith('Invalid credentials')
      })
    })

    test('handles 2FA verification error', async () => {
      const mockLoginResponse = {
        twoFactorRequired: true,
        userId: 'user123'
      }

      const errorResponse = {
        message: 'Invalid 2FA code'
      }

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockLoginResponse
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => errorResponse
        })

      renderLoginForm()

      // Initial login
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
      fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

      await waitFor(() => {
        expect(screen.getByLabelText('Code')).toBeInTheDocument()
      })

      // Enter wrong 2FA code
      fireEvent.change(screen.getByLabelText('Code'), { target: { value: '000000' } })
      fireEvent.click(screen.getByRole('button', { name: 'Verify Code' }))

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith('Invalid 2FA code')
      })
    })

    test('handles network error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      renderLoginForm()

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
      fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith('Network error')
      })
    })

    test('handles unknown error', async () => {
      fetch.mockRejectedValueOnce('Unknown error')

      renderLoginForm()

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
      fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith('An unexpected error occurred')
      })
    })
  })

  describe('Loading State', () => {
    test('shows loading state during login', async () => {
      // Create a promise that we can control
      let resolvePromise
      const mockPromise = new Promise((resolve) => {
        resolvePromise = resolve
      })

      fetch.mockReturnValueOnce(mockPromise)

      renderLoginForm()

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
      fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByAltText('Loading...')).toBeInTheDocument()
      })

      // Resolve the promise to finish loading
      resolvePromise({
        ok: true,
        json: async () => ({ Token: 'token', userId: 'user123' })
      })

      await waitFor(() => {
        expect(screen.queryByAltText('Loading...')).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Validation', () => {
    test('prevents form submission with empty fields', () => {
      renderLoginForm()

      const form = screen.getByRole('button', { name: 'Log In' }).closest('form')
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })

      fireEvent(form, submitEvent)

      // Form should not submit due to required field validation
      expect(fetch).not.toHaveBeenCalled()
    })
  })
})
